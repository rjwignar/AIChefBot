// define responses issued to fetch requests made for IMAGES (recipe image)

// get our cloudinary image methods
import { addImage, deleteImage } from "./images";

// handler for all relevant requests to /api/images/request
async function handler(req, res) {
    switch (req.method) {
        // POST
        case "POST": {
            try {
                // Add recipe image
                try {
                    const imageDetails = await addImage(req.body.imageURL);
                    res.status(201).json({ secure_url: imageDetails.secure_url, public_id: imageDetails.public_id });
                } catch (err) {
                    console.error(err);
                }
            } catch (err) {
                res.status(500).json({ message: "Failed to add recipe image.", "Error: ": err });
            }
            break;
        }

        // DELETE
        case "DELETE": {
            try {
                // Await recipe deletion
                const result = await deleteImage(req.body.image_id);
                if (result === "ok") {
                    // image successfully deleted
                    res.status(204).json();
                } else {
                    res.status(404).json({ message: "Recipe image was not deleted." });
                }
            } catch (err) {
                res.status(500).json({ message: "Failed to delete recipe image.", "Error: ": err });
            }
            break;
        }
    }
}

export default handler;
