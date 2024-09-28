import mongoose, { Document, Schema, model } from 'mongoose';



const orderSchema: Schema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
      },
      billQuantity:{
        type:Number

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
 
 
}, { timestamps: true });

const Order   = model('Order', orderSchema);

export default Order;