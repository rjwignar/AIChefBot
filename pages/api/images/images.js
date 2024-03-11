require("dotenv").config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function addImage(imageURL) {
    try {
        cloudinary.uploader.upload(
            imageURL,
            {},
            function (error, result) {
                console.log(result);

                // destructure secure_url and public_id from result
                const { secure_url, public_id } = result;
                console.log("image url and id to be returned as JSON", {secure_url, public_id});
                return {secure_url, public_id};
            }
        );
    } catch (err) {
        console.error(err);
        return null;
    }
}