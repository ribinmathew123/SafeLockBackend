import mongoose from "mongoose";

const passwordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
  
  name: {
      type:String, 
      required:[true, 'Please Add Name']
  },

  password:{
       type: String,
       required:true,
  },


  status:{
    type:Boolean,
    required:true,
    default:false
},
  
}, {timestamps: true})
const Password = mongoose.model("Password", passwordSchema);

export default Password;
