const cloudinary = require('cloudinary').v2;

const uploadFileCloudinary = async(file)=>{

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })

    const cloudinaryRsponse = await cloudinary.uploader.upload(file.path);
    return cloudinaryRsponse
}

module.exports={
    uploadFileCloudinary
}