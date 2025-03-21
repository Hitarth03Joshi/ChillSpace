const multer = require("multer");
const bcrypt = require("bcrypt");

const userModel = require("../models/User");
const cloudinaryUtil = require("../utils/CloudinaryUtil");

const storage = multer.diskStorage({
  destination:"./uploads",
  filename: function (req,file,cb){
      cb(null,file.originalname);
  }
});

const upload = multer({
  storage:storage
}).single('image');
//User Registretion

const addUser = async(req,res)=>{
  upload(req,res,async(err)=>{
    if(err){
        res.status(500).json({
            message:err.message
        })
    }
    else{

      try{
          const findByEMail = await userModel.findOne({email:req.body.email});
          if(findByEMail != null){
              res.status(409).json({
                  message:"Account already exists"
              })
          }
          else
          {
              const salt = bcrypt.genSaltSync(10);
              const hashedPassword = bcrypt.hashSync(req.body.password,salt);
              req.body.password=hashedPassword;
              const cloudinaryResponse = await cloudinaryUtil.uploadFileCloudinary(req.file)
              req.body.profileImagePath = cloudinaryResponse.secure_url
              const user = await userModel.create(req.body);
              res.status(201).json({
                  message:"user created...",
                  data:user
              })
          }
      }
      catch(err){
          console.log(err);
          res.status(500).json({
              message:"error...",
              data:err.message
          })
      }
    }
  })
}

const loginUser = async(req,res)=>{
    try{
        const findByEMail = await userModel.findOne({email:req.body.email}) . populate("roleId");
        console.log(findByEMail);
        if(findByEMail != null){
            const ismatch = bcrypt.compareSync(req.body.password,findByEMail.password);
            if(ismatch == true){
                res.status(200).json({
                    message:"login success...",
                    data:findByEMail
                })
            }
            else{
                res.status(401).json({
                    message:"Invalid cred..."
                })
            }
        }
        else{
            res.status(404).json({
                message:"Invalid email..."
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:"server err....",
            data:err.message
        })
    }
}

const deleteUser = async(req,res)=>{
    try{
        const deletedUser = await userModel.findByIdAndDelete(req.params.id)
        res.json({
            message:"User deleted...",
            data:deletedUser
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

const getUser = async(req,res)=>{
    const user = await userModel.findById(req.params.id)
    res.json({
        message:"User fetched...",
        data:user
    })
}

const getUsers = async(req,res)=>{

    const users = await userModel.find()
    res.json({
        message:"User fetched....",
        data:users
    })
}


module.exports={
    addUser,loginUser,deleteUser,getUser,getUsers
}