
// define responses issued to fetch requests made for RECIPES

export default function message(req,res) {
    res.json({"message": "this route is for recipe requests."})
}