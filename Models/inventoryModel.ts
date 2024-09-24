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
  quantity: {
    type: String,
    required: true,
  },
 
 
 
});

const Inventory = model('Inventory', inventorySchema);

export default Inventory;