const Mobile_Phones = require('../../models/items/mobile_phones');
const User = require('../../models/user');
const Ad = require('../../models/ad');
const publicResponse = require('../../helpers/response');

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
            const owner = await User.findOne({userId: req.user.id});
            const category = "Mobile Phones & Tablets";

            //create item
            const phone = new Mobile_Phones({
                category,
                owner,
                ...req.body
            });

            await phone.save();

            const ad = new Ad({
                category,
                subCategory: "Mobile Phones",
                user: owner._id,
                product: phone._id,
                onModel: 'Mobile_Phone'
            });

            await ad.save();

            /*upload images to cloudinary & save the urls to doc. 
                cloudinary doesn't support uploading multiple image files 
                at once.
                solved by mapping through the files and uploading them one after the other
            */
            req.files.map(file => {

                let index= req.files.indexOf(file);

                const upload = async() => {
                    const images = await cloudinary.uploader.upload(file.path, {
                        folder: 'sell-it/product_image/mobile-phones',
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

            res
            .status(201)
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
            const data = await Ad.find(
                {subCategory: "Mobile Phones"}
            )
            .sort({"promotion.type": -1, createdAt: -1})
            .populate({path: 'product', select: '-itemImages.cloudinary_ids -_id -owner -__v'})
            .populate({path: 'user', select: '-_id -__v'});

            if(data.length === 0){
                res
                .status(200)
                .json({
                    status: 'success',
                    message: "empty list"
                })
            }
            publicResponse.product(data, req, res);
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
    editMobilePhone: async(req, res) => {
        const {id} = req.params;
        try{
            const post = await Mobile_Phones.findById(id);
            if(!post){
                return res
                .status(400)
                .json({
                    status: "fail",
                    message: `No mobile phone with id ${id}`
                })
            }
            //get user id
            const user = await User.findOne({userId: req.user.id});
            //get owner from post
            const owner = post.owner.toString();
            
            if(owner !== user.id){
                return res
                .status(401)
                .json({
                    status: "success",
                    message: "You don't have permission to perform this action"
                });
            }
            await Mobile_Phones.findByIdAndUpdate(id, req.body, {new: true});
            res
            .status(200)
            .json({
                status: 'success',
                message: "update successful"
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
    }
    
}