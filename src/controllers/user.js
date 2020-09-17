const User = require('../models/user');
const JWT = require('jsonwebtoken');

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

    //Create a new user using the local method
    signUp: async (req, res) => {
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
            //create the user object
            const user = new User({
                method: "local",
                local: {
                    email,
                    password
                },
                role,
                firstName,
                lastName
            });
            //save the new user doc
            await user.save();

            //sign token
            const token = signToken(user)
            //respond with the new user document
            res
            .status(201)
            .json({
                status: 'success',
                message: "user created successfully!",
                data: {
                    token,
                    role: user.role,
                    email: user.local.email
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

    login: async (req, res) => {
        try{
            const token =  signToken(req.user);
            const {local: {email}, role, firstName, lastName} = req.user;
            res
            .status(200)
            .json({
                status: 'success',
                data: {
                    token,
                    role,
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
            const {role, firstName, lastName, google: {email}} = req.user;
            const token = signToken(req.user);
            res
            .status(200)
            .json({
                status: 'success',
                data: {
                    token,
                    role,
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
    
};