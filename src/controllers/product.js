const Product = require('../models/product');
const User = require('../models/user');

module.exports = {

    createProduct: async (req, res) => {
        try{
            const {category, productName, price, description} = req.body;
            const {id} = req.user;

            const product = new Product({
                category,
                seller: id,
                productName,
                price,
                description
            });

            await product.save();

            await User.findByIdAndUpdate(id, { $push: { products: product } }, { new: true, useFindAndModify: false })

            res
            .status(201)
            .json({
                status: 'success',
                message: "post product successful!",
                data: {
                    product
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

    getProducts: async (req, res) => {
        try{
            const products = await Product.find().populate({
                path: 'seller', 
                select: 'status _id location phone'
            }).sort('-createdAt');

            if(!products){
                res
                .status(200)
                .json({
                    status: 'success',
                    message: 'No available products'
                })
            } else {
                res
                .status(200)
                .json({
                    status: 'success',
                    count: products.length,
                    data: {
                        products
                    }
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

    getProductById: async (req, res) => {
        const id = req.params.id;
        try{
            const product = await Product.findById(id);
            if(product){
                res
                .status(200)
                .json({
                    status: 'success',
                    data: {
                        product
                    }
                })
            } else {
                res
                .status(400)
                .json({
                    status: 'fail',
                    error: {
                        message: `product with this id doesn't exist`
                    }
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

    getProductsByCategory: async (req, res) => {
        try{
            const query = req.query;
            
            const {category} = query;
            
            const products = await Product.find({"category": category}).populate({
                path: "seller", 
                select: '_id status phone location'
            }).sort('-createdAt');

            if(products.length === 0 ){
                res
                .status(200)
                .json({
                    status: 'success',
                    message: 'No available products in this category'
                })
            } else {
                res
                .status(200)
                .json({
                    status: 'success',
                    count: products.length,
                    data: {
                        products
                    }
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

    getProductsByUser: async (req, res) => {
        try{
            const {id} = req.user;
            const products = await Product.find({"seller": id}).sort('-createdAt');
            if(products.length === 0){
                res
                .status(200)
                .json({
                    status: "success",
                    message: "You haven't posted any product"
                })
            } else{
                res
                .status(200)
                .json({
                    status: "success",
                    count: products.length,
                    data: {
                        products
                    }
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
    }
}