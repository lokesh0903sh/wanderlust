const mongoose = require("mongoose");
const Review = require("./review.js");
main().then(()=>{
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
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
    image:{
        url: String,
        filename: String
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
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
})

const Listings = mongoose.model("listings", listingSchema);

module.exports = Listings;