import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { lotteryModel } from "./lotterySchema.js";
import { data } from "./lotteryModel.js";
import cron from "node-cron";
import { userModel } from "./userSchema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config()

const app= express();
const port= process.env.PORT;
app.use(express.urlencoded({extended: false}));
app.use(cors({
    origin: 'https://first-rho-ecru.vercel.app', 
    methods: 'GET, POST, PUT, DELETE, OPTIONS', 
    allowedHeaders: 'Content-Type, Authorization', 
    credentials: true, 
}));

app.options('*', cors()); 



app.use(express.json())
mongoose.connect(process.env.MongoLink);

cron.schedule("0 0 * * *", async()=>{

    const getData= await lotteryModel.find();
    if(getData.length===0){
        try{
            const sendData= await lotteryModel.insertMany(data);
        }catch(e){
            console.log(e)
        }
    }else{
        try{
        const sendData= await lotteryModel.updateMany({}, {$set: {winningNumber:{open: "***", jodi: "**", close: "***"},status: "RUNNING"}});
        }catch(e){
            console.log(e);
        }
    }
   
})

app.get("/", (req, res)=>{
    res.send("hello");
})

app.post("/registerUser", async (req, res) => {
    const { name, email, password, mobileNumber } = req.body;


    if (!name || !email || !password || !mobileNumber) {
        return res.status(400).send({ success: false, message: "All fields are required." });
    }
    try {

        const existingUser = await userModel.findOne({
            $or: [{ email }, { number: mobileNumber }],
        });
        if (existingUser) {
            return res.status(200).send({ success: false, message: "Email or mobile number already registered." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let authority="user";

        if(password==="galiDeshawarAdmin@2025"){
            authority="admin";
        }

        const newUser = {
            name,
            email,
            password: hashedPassword,
            number: mobileNumber,
            authority,
            bet: { betName: "", betType: "", amount: "", digit: null },
        };

        const register = await userModel.create(newUser);
        res.status(200).send({ success: true, message: "Successfully registered." });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(200).send({ success: false, message: "Could not register. Please try again later." });
    }
});

app.post("/updateUser", async(req, res)=>{
    const {number, name, email, password, mobile}= req.body;

    const existingUser = await userModel.findOne({
        $or: [{ email }, { number:mobile }],
    });
    if (existingUser) {
        return res.status(200).send({ success: false, message: "Email or mobile number already registered." });
    }
    try{
    
    const user= await userModel.findOne({number});
        if(user){
            if(name){
                user.name= name;
            }
            if(email){
                user.email= email;
            }
            if(mobile){
                user.number= mobile;
            }
            if(password){
                if(password==="galiDeshawarAdmin@2025"){
                    res.send({success: false, message: "could not get this password"})
                }else{
                const salt = await bcrypt.genSalt(10);
                user.password= await bcrypt.hash(password, salt);
                }
            }
        
            await user.save();
            res.status(200).send({success: true, message: "successfully updated"})
        }else{
            res.status(200).send({success: false, message: "couldn't find you"})
        }
    
    }catch(e){
        res.status(400).send({success: false, message: "couldn't updated"})
    }
})

app.post("/getUser", async(req, res)=>{
    const {number}= req.body;
    try{
        const user=await userModel.findOne({number});
        res.status(200).send({success:true, user});
    }catch(e){
        res.status(400).send({success:false, user:""});
    }
});

app.post("/setWallet", async(req, res)=>{
    const {wallet, number}= req.body;
    try{
        const user= await userModel.findOne({number});
        if(user){
            user.wallet= wallet;
            await user.save();
        }

        res.status(200).send({success: true})
    }catch(e){
        res.status(400).send({success: false});
    }
   

})

app.post("/verifyUser", async (req, res) => {
    const { number, password } = req.body;

    try {
        // Find user by mobile number
        const user = await userModel.findOne({ number });

        if (!user) {
            return res.status(400).send({ success: false, message: "Phone number is not registered." });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ success: false, message: "Incorrect password." });
        }

        // If password is valid, send success response
        res.status(200).send({ success: true, message: "User verified." });
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).send({ success: false, message: "An error occurred. Please try again later." });
    }
});


app.get("/lotteryData", async(req, res)=>{
    const response= await lotteryModel.find();
    res.send(response);

});

app.post("/submitData", async (req, res) => {
    try {
        const { lotteryName, lotteryData } = req.body;

        const findData = await lotteryModel.findOne({ lotteryName });
        console.log(lotteryData);

        if (findData) {
            if (lotteryData.open) {
                findData.winningNumber.open = lotteryData.open;
            }
            if (lotteryData.jodi) {
                findData.winningNumber.jodi = lotteryData.jodi;
            }
            if (lotteryData.close) {
                findData.winningNumber.close = lotteryData.close;
                findData.status= "CLOSED";
            }

            await findData.save();
            return res.status(200).send("Successfully updated.");
        }

        return res.status(404).send("Lottery not found.");
    } catch (error) {
        console.error("Error while submitting data:", error);
        res.status(500).send("Internal server error.");
    }
});

app.post("/setBet",async(req,res)=>{
    const {bet, number}= req.body;
    const user= await userModel.findOne({number});
    if(user){
        bet.forEach((singleBet) => {
            user.bet.push(singleBet); 
        });
        await user.save();
        res.send({success:true, message:"Bet placed"})
    }else{
        res.send({success:false, message:"User not found"})
    }
})


app.listen(port, ()=>{
    console.log(`app is listening on ${port}`)
})