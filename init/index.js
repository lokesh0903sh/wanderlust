const mongoose = require("mongoose");
const initData = require("./data.js");
const Listings = require("../models/listing.js");

main().then(()=>{
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}

const initDB = async ()=>{
    await Listings.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "66ba13d116c5babcb1256705",}));
    await Listings.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
