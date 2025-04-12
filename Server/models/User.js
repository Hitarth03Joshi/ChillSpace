const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roleId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Role",
      required:true
    },
    profileImagePath: {
      type: String,
      default: "",
    },
    tripList: {
      type: Array,
      default: [],
    },
    wishList: {
      type: Array,
      default: [],
    },
    propertyList: {
      type: Array,
      ref: "Listing",
      default: [],
    },
    reservationList: {
      type: Array,
      default: [],
    }
  },
  { timestamps: true }
)

const User = mongoose.model("User", UserSchema)
module.exports = User