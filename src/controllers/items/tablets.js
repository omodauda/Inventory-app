const Tablet = require('../../models/items/tablets');
const User = require('../../models/user');
const Category = require('../../models/category');
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
            const {brand} = req.body;
            const category = "Mobile Phones & Tablets";
            const owner = await User.findOne({userId: req.user.id});

            const tablet = new Tablet({
                category,
                owner: owner._id,
                brand
            });

            await tablet.save();

            const ad = new Ad({
                category,
                subCategory: 'Tablets',
                user: owner._id,
                product: tablet._id,
                onModel: 'Tablet'
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
            const data = await Ad.find(
                {subCategory: 'Tablets'}
            )
            .populate({path: 'product', select: '-itemImages.cloudinary_ids -_id -owner -__v'})
            .populate({path: 'user', select: '-_id -__v'});

            if(data.length === 0){
                res
                .status(400)
                .json({
                    status: 'success',
                    message: "No item in tablets"
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
    editTablet: async(req, res) => {
        const {id} = req.params;
        try{
            const tablet = await Tablet.findById(id);
            if(!tablet){
                return res
                .status(400)
                .json({
                    status: "fail",
                    message: `No tablet with id ${id}`
                })
            }
            //get user id
            const user = await User.findOne({userId: req.user.id});
            //get owner of tablet
            const owner = tablet.owner.toString();
            
            if(owner !== user.id){
                return res
                .status(400)
                .json({
                    status: "success",
                    message: "You don't have permission to perform this action"
                });
            }
            await Tablet.findByIdAndUpdate(id, req.body, {new: true});
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