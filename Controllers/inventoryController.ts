import { NextFunction, Request, Response } from "express";
import Inventory from "../Models/inventoryModel";


export const addItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

  
        const {name,description,quantity}=req.body

        const product={
            name:name,
            description:description,
            quantity:quantity
        }

        const findItem=await Inventory.findOne({name:name})
        if (findItem) {
            throw new Error('Product Already Exist');
          }

         await Inventory.create(product);
        
    
  
     
     
        res.status(201).json({
          success: true,
          message: "Product created successfully",
         
        });
      
    
    } catch (error) {
      next(error);
    }
  };
  

  export const fetchAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

        const data=await Inventory.find()

       
        
     
     
        res.status(201).json({
          success: true,
          message: "Product fetched successfully",
          data:{data}
         
        });
      
    
    } catch (error) {
      next(error);
    }
  };


  export const editItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      
        
      const { _id, ...updateData } = req.body;
      const updatedItem = await Inventory.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
      console.log(updatedItem);
      
  
      if (!updatedItem) {
        res.status(404).json({
          success: false,
          message: "Item not found",
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      next(error);
    }
  };
  

  export const deleteItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
     

        const {_id}=req.body
        
      
      const deleteItem=await Inventory.findByIdAndDelete({_id:_id})
      console.log(deleteItem);
      
  
      if (!deleteItem) {
        res.status(404).json({
          success: false,
          message: "Item not found",
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: "Item deleted successfully",
     
      });
    } catch (error) {
      next(error);
    }
  };
  