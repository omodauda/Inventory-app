const User = require('../models/user');
const JWT = require('jsonwebtoken');
const sendMail = require('../helpers/email');
const Auth = require('../models/auth');
const generate_token = require('../helpers/token_generator');

// Signs user with JWT
const signToken = (user) => {
    return JWT.sign({
        iss: 'omodauda',
        sub: user.id,
        role: user.role,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 10)
    },
    process.env.JWT_SECRET
    );
};

module.exports = {
    
    signUp: async (req, res) => {
        //Create a new user using the local method
        try{
            //define the input from the request body
            const { email, password, firstName, lastName, role } = req.body;

            //check if user with the same email already exist
            const existingUser = await Auth.findOne({'local.email': email});
            const existingGoogleAccount = await Auth.findOne({'google.email': email});

            if(existingUser || existingGoogleAccount){
                return res
                .status(406)
                .json({
                    status: 'fail',
                    error: {
                        message: `E-mail ${email} already in use`
                    }
                })
            };

            //generate confirmation token
            const confirm_token_data = await generate_token();
            
            const {confirmToken, tokenExpiration} = confirm_token_data;

            //create the user object
            const user = new Auth({
                method: "local",
                local: {
                    email,
                    password
                },
                role,
                confirmationToken:{
                    token: confirmToken,
                    tokenExpiration
                },
                // firstName,
                // lastName
            });

            const userProfile = new User({
                userId: user,
                email,
                firstName,
                lastName
            });

            //save the new user doc
            await user.save();

            //save user profile
            await userProfile.save();

            //send confirmationToken to user e-mail
            const recipient = user.local.email;
            const subject = "Your account confirmation token (valid for 10 mins)";
            const text = `Thank you for joining inventory app. Your confirmation token: ${confirmToken}`;

            sendMail(recipient, subject, text);

            //sign authentication token
            const token = signToken(user)
            //respond with the new user document
            res
            .status(201)
            .json({
                status: 'success',
                message: "user created successfully!",
                data: {
                    token,
                    confirmationToken: confirmToken,
                    role: user.role,
                    email: user.local.email,
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName
                }
            });
        }
        catch(error){
            res
            .status(400)
            .json({
                status: "fail",
                error: {
                    message: error.message
                }
            })
        }
    },

    verifyUser: async (req, res) => {
        try{
            const {email, confirmToken} = req.body;

            const user = await Auth.findOne({'local.email': email});
    
            const {confirmationToken: {token, tokenExpiration}} = user;
            //get the current time
            const date = new Date(Date.now());

            if(!user){
                return res
                .status(400)
                .json({
                    status: 'fail',
                    error: {
                        message: 'user does not exist'
                    }
                })
            } else if(confirmToken !== token){  //if token is incorrect
                return res
                .status(400)
                .json({
                    status: 'fail',
                    error: {
                        message: 'Invalid token'
                    }
                })
            } else if (confirmToken === token && date > tokenExpiration) {  //if token is valid but expiration time has elapsed
                return res
                .status(400)
                .json({
                    status: 'fail',
                    error: {
                        message: 'Expired token'
                    }
                })
            } else {  //if both conditions are met, verify user and set token & expiration fields to null

                await Auth.findOneAndUpdate(
                    {'local.email': email}, 
                    {status: "Verified", confirmationToken: {token: null, tokenExpiration: null}}
                );
                return res
                .status(200)
                .json({
                    status: 'success',
                    message: 'Verification successful'
                })
            }
        }
        catch(error){
            res
            .status(400)
            .json({
                status: 'fail',
                error: {
                    message: error.message
                }
            })
        }
    },

    login: async (req, res) => {
        
        try{
            const token =  signToken(req.user);

            const {local: {email}, role, status, id} = req.user;

            const user = await User.find({'userId': id});

            const [{firstName, lastName}] = user;
            
            res
            .status(200)
            .json({
                status: 'success',
                data: {
                    token,
                    role,
                    status,
                    email,
                    firstName,
                    lastName
                }
            })
        }
        catch(error){
            res
            .status(400)
            .json({
                status: 'fail',
                error: {
                    message: error.message
                }
            })
        }

    },

    googleOauth: async (req, res) => {
        try{
            const {role, status, firstName, lastName, google: {email}} = req.user;
            const token = signToken(req.user);
            res
            .status(200)
            .json({
                status: 'success',
                data: {
                    token,
                    role,
                    status,
                    email,
                    firstName,
                    lastName
                }
            })
        }
        catch(error) {
            res
            .status(400)
            .json({
                status: 'fail',
                error: {
                    message: error.message
                }
            })
        }
    },

    updateUser: async (req, res) => {
        try{
            const {id} = req.user
            //dynamically update user details.
            await User.findByIdAndUpdate(id, req.body);

            res
            .status(200)
            .json({
                status: "success",
                message: "Update successful"
            })
        }
        catch(error){
            res
            .status(400)
            .json({
                status: 'fail',
                error: {
                    message: error.message
                }
            })
        }
    }
    
};