import mongoose, { Document, Schema, model } from 'mongoose';



const userSchema: Schema = new mongoose.Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  username: {
    type: String,
    required: true,
  },
 
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
 
 
 
});

const User = model('User', userSchema);

export default User;