import mongoose from "mongoose";

const lotterySchema= mongoose.Schema({
    initialTime:{type: String},
    finalTime: {type: String},
    winningNumber:
        {
            open: {type:String},
            jodi: {type:String},
            close: {type: String},
        },
    lotteryName: {type: String},
    status: {type: String},
    RemainingTime: {type: String}
});

export const lotteryModel= mongoose.model("lottery", lotterySchema);
