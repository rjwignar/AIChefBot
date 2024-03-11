// define responses issued to fetch requests made for IMAGES (recipe image)

// get our cloudinary image methods
import { addImage } from "./images";

// handler for all relevant requests
async function handler(req, res) {
  switch (req.method) {
    // POST
    case "POST": {
      try {
        // Add recipe image
        try {
          const imageDetails = await addImage(req.body);
          res.status(201).json({imageURL: imageDetails.secure_url, image_id: imageDetails.public_id});
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        res.status(500).json({message: "Failed to add recipe image.", "Error: ": err});
      }
      break;
    }
  }
}

export default handler;
