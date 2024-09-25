import cloudinary from "../../Config/cloudinaryConfig";


export const deleteImageCloudinary=async(findImage:any)=>{
    const urlParts = findImage.split('/');
    const uploadIndex = urlParts.lastIndexOf('upload');
    const publicId = 'upload/' + urlParts.slice(uploadIndex + 1).join('/').split('.')[0];

   try {
     await cloudinary.v2.uploader.destroy(publicId);
     console.log("Image deleted from Cloudinary successfully.");
   } catch (error) {
     console.error("Error deleting image from Cloudinary:", error);
     return "Error deleting image from Cloudinary";
   }

}