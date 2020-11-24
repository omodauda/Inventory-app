const Mobile_Phones = require('../../models/items/mobile_phones');
const User = require('../../models/user');
const Ad = require('../../models/ad');
const publicResponse = require('../../helpers/response');

const cloudinary = require('../../helpers/cloudinary');
const {initPayment} = require('../../helpers/payment');

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
            const owner = await User.findOne({userId: req.user.id});
            const category = "Mobile Phones & Tablets";

            //create item
            const phone = new Mobile_Phones({
                category,
                owner,
                brand,
                model
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
            const data = await Ad.find(
                {subCategory: "Mobile Phones"}
            )
            .populate({path: 'product', select: '-itemImages.cloudinary_ids -_id -owner -__v'})
            .populate({path: 'user', select: '-_id -__v'});

            if(data.length === 0){
                res
                .status(400)
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

    verifyPost: async(req, res) => {
        try{
        
            const {id} = req.params;

            const find = await Mobile_Phones.findById(id);

            if(!find){
                return res
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
            });
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
    },
    // promotePost: async(req, res) => {
    //     const {id} = req.params;
    //     const {email, plan_code} = req.body;
    //     // const email = 'omodauda.dl@gmail.com';
        // const plan_code = 'PLN_trj2pmmxd5dajkz'
        
    //     try{
    //         //get user sending request
    //         const user = await User.findOne({userId: req.user.id});
    //         //get the item
    //         const phone = await Mobile_Phones.findById(id);
    //         // console.log('user.id', user._id);
    //         // console.log('item.owner', phone.owner);
    //         const owner = phone.owner.toString();
    //         //if the item owner does match the User sending the request return
    //         if(user.id !== owner){
    //             return res
    //             .status(400)
    //             .json({
    //                 status: 'fail',
    //                 message: "You don't have permission to perform this action"
    //             })
    //         }
    //         //initialize payment
    //         const response = await initPayment(email, plan_code);
    //         // console.log(response)
    //         const {authorization_url, reference} = response;
    //         //save payment ref
    //         await Mobile_Phones.findByIdAndUpdate(id, {"promotion.ref": reference});

    //         res
    //         .status(201)
    //         .json({
    //             status: 'success',
    //             message: "payment initialization successful",
    //             data:{
    //                 authorization_url
    //             }
    //         })

    //     }catch(error){
    //         res
    //         .status(500)
    //         .json({
    //             status: "fail",
    //             error: {
    //                 message: error
    //             }
    //         })
    //     }
    // }
}