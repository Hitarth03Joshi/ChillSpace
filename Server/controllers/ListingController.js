const router = require("express").Router();
const multer = require("multer");
const cloudinaryUtils = require("../utils/CloudinaryUtil");
const Listing = require("../models/Listing");
const User = require("../models/User")

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination:"./uploads",
  filename: function (req,file,cb){
      cb(null,file.originalname);
  }
});

const upload = multer({
  storage:storage
}).array("images", 10);

/* CREATE LISTING */
const 
addListing= async (req, res) => {
  upload(req, res, async (err) => {
    if(err){
      res.status(500).json({
        message:err.message
      })
    }
    else{
      try {
        /* Take the information from the form */
        const {
          creator,
          category,
          type,
          streetAddress,
          aptSuite,
          city,
          province,
          country,
          guestCount,
          bedroomCount,
          bedCount,
          bathroomCount,
          amenities,
          title,
          description,
          highlight,
          highlightDesc,
          price,
        } = req.body;
        
        // Ensure files exist
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "No files uploaded." });
      }

      // Upload multiple files to Cloudinary
      const uploadPromises = req.files.map((file) =>
        cloudinaryUtils.uploadFileCloudinary(file)
      );

      // Wait for all uploads to finish
      const uploadedImages = await Promise.all(uploadPromises);

      // Extract secure URLs from Cloudinary responses
      const listingPhotoPaths = uploadedImages.map((img) => img.secure_url);

    
        const newListing = new Listing({
          creator,
          category,
          type,
          streetAddress,
          aptSuite,
          city,
          province,
          country,
          guestCount,
          bedroomCount,
          bedCount,
          bathroomCount,
          amenities,
          listingPhotoPaths,
          title,
          description,
          highlight,
          highlightDesc,
          price,
        })
    
        await newListing.save()
        // Add the listing ID to the user's listings array
        await User.findByIdAndUpdate(creator, { $push: { propertyList: newListing._id } })
        res.status(200).json(newListing)
      } catch (err) {
        res.status(409).json({ message: "Fail to create Listing", error: err.message })
        console.log(err)
      }
    }
  })
  
}

/* GET lISTINGS BY CATEGORY */
const getListingByCategory= async (req, res) => {
  const qCategory = req.query.category

  try {
    let listings
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate("creator")
    } else {
      listings = await Listing.find().populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
}

/* GET LISTINGS BY SEARCH */
const getBySearch= async (req, res) => {
  const { search } = req.params

  try {
    let listings = []

    if (search === "all") {
      listings = await Listing.find().populate("creator")
    } else {
      listings = await Listing.find({
        $or: [
          { category: {$regex: search, $options: "i" } },
          { title: {$regex: search, $options: "i" } },
        ]
      }).populate("creator")
    }

    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
    console.log(err)
  }
}

/* LISTING DETAILS */
const listingDetail=async (req, res) => {
  try {
    const { listingId } = req.params
    const listing = await Listing.findById(listingId).populate("creator")
    res.status(202).json(listing)
  } catch (err) {
    res.status(404).json({ message: "Listing can not found!", error: err.message })
  }
}

const updateListing = async (req,res)=>{
  upload(req, res, async(err)=>{
    if(err){
      res.status(500).json({
        message:err.message
      })
    }
    else{
      try {
        if(req.files && req.files.length > 0){
          const uploadPromises = req.files.map((file) =>
            cloudinaryUtils.uploadFileCloudinary(file)
          );
          const uploadedImages = await Promise.all(uploadPromises);
          const listingPhotoPaths = uploadedImages.map((img) => img.secure_url);
          req.body.listingPhotoPaths = listingPhotoPaths
        }
        const updatedListing = await Listing.findByIdAndUpdate(req.params.listingId, req.body, { new: true })
        res.status(200).json(updatedListing)
      }catch(err){
        res.status(409).json({ message: "Fail to update Listing", error: err.message })
      }
    }
  })
}

const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find().populate("creator")
    res.status(200).json(listings)
  } catch (err) {
    res.status(404).json({ message: "Fail to fetch listings", error: err.message })
  }
}

module.exports = {
    addListing,
    getListingByCategory,
    getBySearch,
    listingDetail,
    updateListing,
    getAllListings
}
