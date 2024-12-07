const mongoose = require("mongoose")
const mongo_url = process.env.MONGO_URL;
mongoose.connect(mongo_url)
    .then(() => {
        console.log("mongoDb conntected...")
    }).catch((err) => {
        console.log("MoongoDB Connection Error")
    })