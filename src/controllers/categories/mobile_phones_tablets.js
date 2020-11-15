const Category = require('../../models/category');

module.exports = {

    mobile_phones_tablets: async(req, res) => {
        const categoryId = "5fb132be4473e32274b208a5"
        try{
            const data = await Category.findById(categoryId).populate({path: 'posts'});

            res
            .status(200)
            .json({
                status: "success",
                data
            })
        }catch(error){
            res.send(error);
        }
    }
}