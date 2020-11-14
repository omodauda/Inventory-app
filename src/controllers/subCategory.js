const SubCategory = require('../models/subCategory');
const Category = require('../models/category');

module.exports = {

    createSubcategory: async(req, res) => {

        const {categoryId, name} = req.body;

        const existingSubcategory = await SubCategory.findOne({name});

        if(existingSubcategory){
            return res
            .status(406)
            .json({
                status: 'fail',
                error: {
                    message: `sub-category ${name} already exists`
                }
            });
        }

        const newSubCategory = new SubCategory({
            category: categoryId,
            name
        });

        await newSubCategory.save();

        await Category.findByIdAndUpdate(categoryId, 
            { $push: { subCategories : newSubCategory }}, 
            { new: true}
        );

        res
        .status(200)
        .json({
            status: 'success',
            message: `sub-category ${name} successfully created`
        });
    }
}