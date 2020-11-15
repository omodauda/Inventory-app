const Tablet = require('../../models/items/tablets');
const User = require('../../models/user');
const Category = require('../../models/category');

module.exports = {
    create: async(req, res) => {
        try{
            const {owner, name} = req.body;
            const category = "5fb132be4473e32274b208a5"

            const tablet = new Tablet({
                category,
                owner,
                name
            });

            await tablet.save();

            await Category.findByIdAndUpdate(category, {$push: {posts: tablet._id}});

            await User.findByIdAndUpdate(owner, { $push: {posts: tablet._id, onModel: 'Tablet'}} );

            res
            .status(200)
            .json({
                status: "success",
                message: "post successfully created",
                data: {
                    tablet
                }
            });
        } catch(error){
            res
            .status(400)
            .json({
                error: {
                    message: error.message
                }
            })
        }
    },
    getAllTablets: async(req, res) => {
        try{
            const data = await Tablet.find();

            if(data.length === 0){
                res
                .status(400)
                .json({
                    status: 'success',
                    message: "No item in tablets"
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
    }
}