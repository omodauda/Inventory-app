const Tablet = require('../../models/items/tablets');
const User = require('../../models/user');
const Category = require('../../models/category');

const cloudinary = require('../../helpers/cloudinary');

module.exports = {
    create: async(req, res) => {
        //if request doesnt contain image files, return
        if(!req.files){
            res
            .status(400)
            .json({
                status: "fail",
                message: "No image found"
            });  
        };

        try{
            const {brand} = req.body;
            const category = "5fb132be4473e32274b208a5";
            const owner = await User.findOne({userId: req.user.id});

            const tablet = new Tablet({
                category,
                owner,
                brand
            });

            await tablet.save();

            /*upload images to cloudinary & save the urls to doc. 
                cloudinary doesn't support uploading multiple image files 
                at once.
                solved by mapping through the files and uploading them one after the other
            */
            req.files.map(file => {

                let index= req.files.indexOf(file);

                const upload = async() => {
                    const images = await cloudinary.uploader.upload(file.path, {
                        folder: 'sell-it/product_image',
                        public_id: `productId=${tablet._id}_image${index}`
                    });

                    //push uploaded image to item doc.
                    await Tablet.findByIdAndUpdate(
                        tablet._id, 
                        {$push: {"itemImages.images": images.secure_url, "itemImages.cloudinary_ids": images.public_id}}
                    );
                } 
                upload();
            });
            //save item in category
            await Category.findByIdAndUpdate(category, {$push: {posts: tablet._id}});

            //save in user profile
            const user = await User.findById(owner._id);

            if(user.onModel.includes('Tablet')){
                await User.findByIdAndUpdate(owner._id, { $push: {posts: tablet._id}} );
            }else{
                await User.findByIdAndUpdate(owner._id, { $push: {posts: tablet._id, onModel: 'Tablet'}} );
            }

            res
            .status(200)
            .json({
                status: "success",
                message: "post successfully created"
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
    },
    verifyPost: async(req, res) => {
        try{
            const {id} = req.params;

            const find = await Tablet.findById(id);

            if(!find){
               return res
               .status(400)
               .json({
                   status: "fail",
                   message: `item with id ${id} not found`
               })
            }

            const data = await Tablet.findByIdAndUpdate(id, {status: "Active"}, {new: true});

           res
           .status(200)
           .json({
               status: "success",
               message: "verification successful",
               data
           });
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