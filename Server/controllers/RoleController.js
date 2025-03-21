const roleModel = require("../models/RoleModel")

const addRole = async(req,res)=>{
    try{
        const newRole = await roleModel.create(req.body)
        res.status(201).json({
            message:"Role created",
            data:newRole
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

const getRole = async(req,res)=>{
    try{
        const role = await roleModel.find()
        res.status(200).json({
            message:"Role fetched",
            data:role
        })
    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports={
    addRole,getRole
}