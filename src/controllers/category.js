const Category = require('../models/category');

module.exports = {

    createCategory: async (req, res) => {

        try{
            //get the category name from req body
            const {name} = req.body;

            //check if a category with the same name exists in the db
            const existingCategory = await Category.findOne({name});

            //if category exists return
            if(existingCategory){
                return res
                .status(406)
                .json({
                    status: 'fail',
                    error: {
                        message: `category with name ${name} already exists`
                    }
                })
            }
            //else save category
            const category = new Category({
                name
            });

            await category.save();

            res
            .status(200)
            .json({
                status: 'success',
                message: `new category ${name} created successfully`
            });

        } catch(error){
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

    getAllCategories: async (req, res) => {

        try{

            const categories = await Category.find().populate('ads').populate('adsCount');

            if(categories.length ===0){
                res
                .status(200)
                .json({
                    status: "success",
                    message: "category list is currently empty"
                });
            } else {
                res
                .status(200)
                .json({
                    status: 'success',
                    data: {
                        categories
                    }
                })
            }
        }catch(error){
            res
            .status(400)
            .json({
                status: "fail",
                error: {
                    message: error.message
                }
            })
        }
    }
}