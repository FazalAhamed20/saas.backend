import axios from 'axios';

export const uploadImageToCloudinary = async (imageUrl: string) => {
  const imageData = new FormData();
  imageData.append('file', imageUrl); // Add image URL
  imageData.append('upload_preset', 'upload');

  try {
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dlitqiyia/image/upload',
      imageData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
