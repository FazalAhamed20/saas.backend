import mongoose, { Document, Schema, model } from 'mongoose';



const addProductSchema: Schema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
name: {
    type: String,
    
  },
 
  category: {
    type: String,
    
  },
  image:{
    type:String
  },
  
 
 
 
});

const Addproduct   = model('Addproduct', addProductSchema);

export default Addproduct;