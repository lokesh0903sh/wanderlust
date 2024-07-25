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
    image:{
        type: String,
        default: "https://media.istockphoto.com/id/487619266/photo/mirrors-lake.jpg?s=1024x1024&w=is&k=20&c=1EWCx9k4m8oPoMYNKSmCk0zoYDZEcwZWv_9P2CkZ_mA=",
        set: (v)=> v===""?"https://media.istockphoto.com/id/487619266/photo/mirrors-lake.jpg?s=1024x1024&w=is&k=20&c=1EWCx9k4m8oPoMYNKSmCk0zoYDZEcwZWv_9P2CkZ_mA=":v,
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
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

const Listings = mongoose.model("listings", listingSchema);

module.exports = Listings;