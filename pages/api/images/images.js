require("dotenv").config();
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function addImage(imageURL) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                imageURL,
                {},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        console.log("result", result);
                        // destructure secure_url and public_id from result
                        const { secure_url, public_id } = result;
                        console.log("image url and id to be returned as JSON", { secure_url, public_id });
                        resolve({ secure_url, public_id });
                    }
                }
            );
        });
}

export async function deleteImage(image_ids){
    return new Promise((resolve, reject) =>{
        // if deleting one image
        if (image_ids.length == 1){
            console.log("deleting only one image");
            cloudinary.uploader.destroy(
                image_ids,
                {},
                function(err, res) {
                    if (err){
                        console.error(err);
                        reject(err);
                    } else{
                        console.log("result before sending", res);
                        resolve(res);
                    }
                }
            )
        }
        // else, delete multiple images
        else{
            console.log("About to delete multiple recipe images");
            cloudinary.api.delete_resources(
                image_ids,
                {},
                function(err, res) {
                    if (err){
                        console.error(err);
                        reject(err);
                    } else{
                        console.log("Deleted a bunch of recipe images", res);
                        resolve(res);
                    }
                }
                );
        }
    })
}