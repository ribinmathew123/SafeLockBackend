import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  
  name: {
      type:String, 
      required:[true, 'Please Add Name']
  },

  email:{
       type: String,
       required:true,
       unique: [true, 'Please Add Email']
  },

  password: {
      type: String,
      required:[true, 'Please Add Password']
  },
  isBlocked:{
      type:Boolean,
      required:true,
      default:false
  },
  isVerified:{
    type:Boolean,
    required:true,
    default:false
},
  
}, {timestamps: true})
const User = mongoose.model("User", userSchema);

export default User;
