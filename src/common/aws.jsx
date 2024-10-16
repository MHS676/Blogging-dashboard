// aws.jsx
import axios from 'axios';

export const uploadImage = async (img) => {
    let imgUrl = null;

    try {
        // Fetch presigned URL from your server
        const response = await axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/get-upload-url`);
        
        console.log('Presigned URL Response:', response); // Debug log

        // Safely extract the upload URL
        const uploadUrl = response?.data?.uploadURL;

        // Check if the uploadUrl is properly defined
        if (!uploadUrl) {
            throw new Error('Upload URL is not defined');
        }

        console.log('Uploading to URL:', uploadUrl); // Log the upload URL

        // Upload image to S3 using the presigned URL
        await axios.put(uploadUrl, img, {
            headers: { 'Content-Type': 'image/jpeg' },
        });

        // Extract the URL without query parameters
        imgUrl = uploadUrl.split('?')[0];
    } catch (error) {
        console.error('Error uploading image:', error);
    }

    return imgUrl;
};
