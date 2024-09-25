import { NextFunction, Request, Response } from "express";
import Inventory from "../Models/inventoryModel";
import Addproduct from "../Models/addProductModel";
import { deleteImageCloudinary } from "../Helpers/cloudinary/delete";

export const addItem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log(req.body);
    
    const { name, description, quantity, price, category, userId } = req.body;
    const productImage = await Addproduct.findOne({ name, category })
    const product = {
      name,
      description,
      quantity,
      price,
      category,
      userId,
      image: productImage?.image,
    };


    const findItem = await Inventory.findOne({ 
      name: name, 
      userId: userId 
    });

    if (findItem) {
      res.status(409).json({
        success: false,
        message: 'Product Already Exists',
      });
      return;
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
    console.log(req.body);
    
    const {userId}=req.body
    console.log('Usr',userId);
    
    const data = await Inventory.find({userId:userId});

    res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};

export const fetchallItems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await Addproduct.find();

    res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      data: { data },
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
    const { _id } = req.body;

    const deleteItem = await Inventory.findByIdAndDelete({ _id: _id });
    console.log(deleteItem);

    if (!deleteItem) {
      res.status(404).json({
        success: false,
        message: "Item not found",
      });
      return;
    }
    await deleteImageCloudinary(deleteItem.image)

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('items',req.body);
    const { name, category, image } = req.body;
    const existProduct = await Addproduct.findOne({ name: name });
    console.log("existed",existProduct);
    

    if (existProduct) {
      res.status(409).json({
        success: false,
        message: 'Product Already Exists',
      });
      return;
    }
   

    await Addproduct.create(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const fetchAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = await Addproduct.aggregate([
      {
        $group: {
          _id: '$category', 
          names: { $addToSet: '$name' },
        },
      },
      {
        $unwind: '$names' 
      },
      {
        $project: {
          _id: 0, 
          category: '$_id',
          name: '$names', 
        },
      },
    ]);


    console.log(categories);
    

    res.status(201).json({
      success: true,
      message: "Product fetched successfully",
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};


export const deleteProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleteId=req.params.id
    console.log(deleteId);
    

    const deleteProduct = await Addproduct.findByIdAndDelete({ _id: deleteId });
    console.log(deleteProduct);

    if (!deleteProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    await deleteImageCloudinary(deleteProduct.image)

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};