require("dotenv").config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function addImage(imageURL) {
    cloudinary.uploader.upload(imageURL,
        {},
        function (error, result) { console.log(result); });
}