const Mobile_Phones = require('../../models/items/mobile_phones');
const Category = require('../../models/category');
const User = require('../../models/user');

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
            const {brand, model} = req.body;
            const category = "5fb132be4473e32274b208a5";
            const owner = await User.findOne({userId: req.user.id});

            //create item
            const phone = new Mobile_Phones({
                category,
                owner,
                brand,
                model
            });

            await phone.save();

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
                        public_id: `productId=${phone._id}_image${index}`
                    });

                    //push uploaded image to item doc.
                    await Mobile_Phones.findByIdAndUpdate(
                        phone._id, 
                        {$push: {"itemImages.images": images.secure_url, "itemImages.cloudinary_ids": images.public_id}}
                    );
                } 
                upload();
            });
            //save item to category
            await Category.findByIdAndUpdate(category, {$push: {posts: phone._id}});

            //save it in user profile
            const user = await User.findById(owner._id);

            if(user.onModel.includes('Mobile_Phone')){
                await User.findByIdAndUpdate(owner._id, { $push: {posts: phone._id}} );
            }else{
                await User.findByIdAndUpdate(owner._id, { $push: {posts: phone._id, onModel: 'Mobile_Phone'}} );
            }

            res
            .status(200)
            .json({
                status: "success",
                message: "post successfully created"
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
            const data = await Mobile_Phones.find();

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
        }catch(err){
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

    },
    verifyPost: async(req, res) => {
        try{
        
            const {id} = req.params;

            const find = await Mobile_Phones.findById(id);

            if(!find){
                res
                .status(400)
                .json({
                    status: "fail",
                    message: `item with id ${id} not found`
                })
            }

            const data = await Mobile_Phones.findByIdAndUpdate(id, {status: "Active"}, {new: true});

            res
            .status(200)
            .json({
                status: "success",
                message: "verification successful",
                data
            })

            

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