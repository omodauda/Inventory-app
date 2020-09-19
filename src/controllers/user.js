const User = require('../models/user');
const JWT = require('jsonwebtoken');
const sendMail = require('../helpers/email');

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
            const existingUser = await User.findOne({'local.email': email});
            const existingGoogleAccount = await User.findOne({'google.email': email});

            if(existingUser || existingGoogleAccount){
                return res
                .status(406)
                .json({
                    status: 'fail',
                    error: {
                        message: `E-mail ${email} already in use`
                    }
                })
            }

            // Generate a confirmation token, save it in the database
            const confirmToken = Math.floor(10000 + Math.random() * 9000);
            //set token expiration time to 10mins
            const tokenExpiration = new Date(Date.now() + 10 * 60 * 1000)
           
            //create the user object
            const user = new User({
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
                firstName,
                lastName
            });
            //save the new user doc
            await user.save();

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
                    firstName,
                    lastName
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

            const user = await User.findOne({'local.email': email});
    
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

                await User.findOneAndUpdate(
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
            const {local: {email}, role, firstName, lastName, status} = req.user;
            
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