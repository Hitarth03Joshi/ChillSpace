const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/User");
const cloudinaryUtil = require("../utils/CloudinaryUtil");


//User Registretion
const addUser = async(req,res)=>{
      try{
          const findByEMail = await userModel.findOne({email:req.body.email});
          if(findByEMail != null){
            if(findByEMail.roleId == req.body.roleId){
                res.status(409).json({
                    message:"Account already exists"
                })
            }
            else{
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(req.body.password,salt);
                req.body.password=hashedPassword;
                if (req.file) {
                    const cloudinaryResponse = await cloudinaryUtil.uploadFileCloudinary(req.file);
                    req.body.profileImagePath = cloudinaryResponse.secure_url;
                  }
                const user = await userModel.create(req.body);
                res.status(201).json({
                    message:"user created...",
                    data:user
                })
            }
          }
          else
          {
              const salt = bcrypt.genSaltSync(10);
              const hashedPassword = bcrypt.hashSync(req.body.password,salt);
              req.body.password=hashedPassword;
              if (req.file) {
                const cloudinaryResponse = await cloudinaryUtil.uploadFileCloudinary(req.file);
                profileImagePath = cloudinaryResponse.secure_url;
              }
              const user = await userModel.create(req.body);
              res.status(201).json({
                  message:"user created...",
                  data:user
              })
          }
      }
      catch(err){
          res.status(500).json({
              message:err.message
          })
      }    
}

const loginUser = async(req,res)=>{
    try{
        const findByEMail = await userModel.findOne({email:req.body.email}) . populate("roleId");
        if(findByEMail != null){
            const ismatch = bcrypt.compareSync(req.body.password,findByEMail.password);
            if(ismatch == true){
                const token = jwt.sign(findByEMail.toObject(), process.env.JWT_SECRET);
                delete findByEMail.password
                // res.status(200).json({ token, user })
                res.status(200).json({
                    message:"login success...",
                    data:findByEMail,
                    token
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
            message:err.message
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

const getUserById = async(req,res)=>{
    try{
        const user = await userModel.findById(req.params.id)
        res.json({
            message:"User fetched...",
            data:user
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }

}

const getUsers = async(req,res)=>{

    const users = await userModel.find().populate("roleId")
    res.json({
        message:"User fetched....",
        data:users
    })
}

const getAllHosts = async(req,res)=>{
    try{
        const hosts = await userModel.find({roleId:"67e3dfe23765b43d5bc82e8d"}).populate("roleId").populate("propertyList")
        res.json({
            message:"Hosts fetched...",
            data:hosts
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports={
    addUser,loginUser,deleteUser,getUserById,getUsers,getAllHosts
}