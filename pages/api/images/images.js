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

export async function deleteImage(image_id){
    return new Promise((resolve, reject) =>{
        cloudinary.uploader.destroy(
            image_id,
            {},
            function(err, res) {
                if (err){
                    console.error(err);
                    reject(err);
                } else{
                    console.log("result", res);
                    resolve(res.result);
                }
            }
        )
    })
}