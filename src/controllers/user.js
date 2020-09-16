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

            if(existingUser){
                return res
                .status(406)
                .json({
                    status: 'fail',
                    data: {
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
                    email: user.local.email,
                    token
                }
            });
        }
        catch(error){
            res
            .status(400)
            .json({
                status: "fail",
                error: error.message
            })
        }
    },

    login: async (req, res) => {
        try{
            const token =  signToken(req.user);
            const {local: {email}, role, firstName, lastName, orders} = req.user;
            res
            .status(200)
            .json({
                status: 'success',
                data: {
                    token,
                    role,
                    email,
                    firstName,
                    lastName,
                    orders
                }
            })
        }
        catch(error){
            res
            .status(400)
            .json({
                status: 'fail',
                error: error.message
            })
        }

    },
    
};