import mongoose, { Document, Schema, model } from 'mongoose';



const inventorySchema: Schema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  name: {
    type: String,
    
  },
 
  description: {
    type: String,
    
  },
  price:{
    type:Number
  },
  quantity: {
    type: String,
    required: true,
  },
  category:{
    type:String
  },
  userId:{
    type:String
  },
  image:{
    type:String
  }
 
 
 
});

const Inventory = model('Inventory', inventorySchema);

export default Inventory;