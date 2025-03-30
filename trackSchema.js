import mongoose from "mongoose";

const trackSchea= mongoose.Schema({
    userName: {type: String},
    number: {type: Number},
    time: {type: Date},
    amount: {type: Number}

});

export const trackModel= mongoose.model("track",trackSchea);