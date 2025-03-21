const cloudinary = require('cloudinary').v2;

const uploadFileCloudinary = async(file)=>{

    cloudinary.config({
        cloud_name:"dlmqbasxh",
        api_key:"871295846695395",
        api_secret:"COV7pjncMOPaj-Afb6NAg1Y2MwM"
    })

    const cloudinaryRsponse = await cloudinary.uploader.upload(file.path);
    return cloudinaryRsponse
}

module.exports={
    uploadFileCloudinary
}