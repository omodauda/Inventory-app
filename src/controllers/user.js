const User = require('../models/user');

module.exports = {

    //Create a new user using the local method
    signUp: async (req, res) => {
        try{
            //define the input from the request body
            const { email, password, firstName, lastName } = req.body;
            //create the user object
            const user = new User({
                method: "local",
                local: {
                    email,
                    password
                },
                firstName,
                lastName
            });
            //save the new user doc
            await user.save();
            //respond with the new user document
            res
            .status(201)
            .json({
                status: 'success',
                data: {
                    message: "user successfully created!"
                }
            });
        }
        catch(error){
            res
            .status(400)
            .json({
                status: "fail",
                data: {
                    message: error.message
                }
            })
        }
    },
};