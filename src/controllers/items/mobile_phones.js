const Mobile_Phones = require('../../models/items/mobile_phones');
const Category = require('../../models/category');
const User = require('../../models/user');

module.exports = {

    create: async(req, res) => {
        try{

            const {owner, brand, model} = req.body;
            const category = "5fb132be4473e32274b208a5"

            const phone = new Mobile_Phones({
                category,
                owner,
                brand,
                model
            });

            await phone.save();

            await Category.findByIdAndUpdate(category, {$push: {posts: phone._id}});

            await User.findByIdAndUpdate(owner, { $push: {posts: phone._id, onModel: 'Mobile_Phone'}} );

            res
            .status(200)
            .json({
                status: "success",
                message: "post successfully created",
                data: {
                    phone
                }
            })

        }catch(error){
            res
            .status(400)
            .json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getAllMobilePhones: async(req, res) => {
        try{
            const data = await Mobile_Phones.find({});

            if(data.length === 0){
                res
                .status(400)
                .json({
                    status: 'success',
                    message: "empty list"
                })
            } else{
               res
                .status(200)
                .json({
                    status: "success",
                    count: data.length,
                    data
                });
            }
        }catch(error){
            res
            .status(400)
            .json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getMobilePhoneById: async(req, res) => {

    }
}