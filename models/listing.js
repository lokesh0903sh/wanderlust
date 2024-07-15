const mongoose = require("mongoose");
main().then(()=>{
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

let listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    img:{
        type: String,
        default: "https://unsplash.com/photos/a-person-climbing-up-the-side-of-a-large-rock-E76-vNiW3ps",
        set: (v)=> v===""?"https://unsplash.com/photos/a-person-climbing-up-the-side-of-a-large-rock-E76-vNiW3ps":v,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    },
});

const Listings = mongoose.model("listings", listingSchema);

module.exports = Listings;