import mongoose from "mongoose";

const userSchema= mongoose.Schema({
    name: {type: String},
    number: {type: Number},
    email: {type: String},
    password: {type: String},
    bcryptPassword: {type: String},
    authority: {type: String},
    bet: [
        {
            betName: {type: String},
            betType: {type: String},
            bidName: {type: String},
            amount: {type: Number},
            digit:{type: Number},
            status: {type: Boolean, default: false}
        }
    ],
    wallet:{type: Number, default: 0},
});

export const userModel= mongoose.model("user", userSchema);