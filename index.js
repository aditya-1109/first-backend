import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { lotteryModel } from "./lotterySchema.js";
import { data } from "./lotteryModel.js";
import { userModel } from "./userSchema.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import errorHandler from "./errorHandler.js";
import { giveMoney, giveMoneyToSangam } from "./giveMoney.js";
import { trackModel } from "./trackSchema.js";

dotenv.config()

const app = express();
const port = process.env.PORT;

app.use(cors());

app.options('*', cors());


app.use(express.urlencoded({ extended: false }));
app.use(express.json())
mongoose.connect(process.env.MongoLink);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.galideshawar.com');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});



app.get("/", (req, res) => {
    res.status(200).send("hiii");
})

app.post("/registerUser", async (req, res) => {
    const { name, email, password, mobileNumber } = req.body;

    console.log(name, email, password, mobileNumber);
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
        let authority = "user";

        if (password === "galiDeshawarAdmin@2025") {
            authority = "admin";
        }
        if (mobileNumber === 9200580590 && password === "galiDeshawarAdmin@2025") {
            authority = "producer";
        }

        const newUser = {
            name,
            email,
            password,
            bcryptPassword: hashedPassword,
            number: mobileNumber,
            authority,
        };

        const register = await userModel.create(newUser);
        res.status(200).send({ success: true, message: "Successfully registered." });
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(200).send({ success: false, message: "Could not register. Please try again later." });
    }
});


app.post("/transferAmount", async (req, res) => {
    const { number, myNumber, amount } = req.body;

    if (!number || !myNumber || !amount || amount <= 0) {
        return res.status(400).send({ success: false, message: "Invalid input data" });
    }

    try {

        const me = await userModel.findOne({ number: myNumber });
        const user = await userModel.findOne({ number });

        if (!me) {
            return res.status(404).send({ success: false, message: "Sender not found" });
        }

        if (!user) {
            return res.status(404).send({ success: false, message: "Receiver not found" });
        }

        if (me.wallet < amount) {
            return res.status(400).send({ success: false, message: "Insufficient balance" });
        }

        me.wallet -= amount;
        user.wallet += amount;

        await me.save();
        await user.save();

        res.status(200).send({ success: true, message: "Successfully transferred" });
    } catch (error) {
        console.error("Error in transferAmount:", error);
        res.status(500).send({ success: false, message: "An error occurred", error: error.message });
    }
});


app.post("/updateUser", async (req, res) => {
    const { number, name, email, password, mobile } = req.body;

    const existingUser = await userModel.findOne({
        $or: [{ email }, { number: mobile }],
    });
    if (existingUser) {
        return res.status(200).send({ success: false, message: "Email or mobile number already registered." });
    }
    try {

        const user = await userModel.findOne({ number });
        if (user) {
            if (name) {
                user.name = name;
            }
            if (email) {
                user.email = email;
            }
            if (mobile) {
                user.number = mobile;
            }
            if (password) {
                if (password === "galiDeshawarAdmin@2025") {
                    res.status(200).send({ success: false, message: "could not get this password" })
                } else {
                    const salt = await bcrypt.genSalt(10);
                    user.bcryptPassword = await bcrypt.hash(password, salt);
                    user.password = password;
                }
            }

            await user.save();
            res.status(200).send({ success: true, message: "successfully updated" })
        } else {
            res.status(200).send({ success: false, message: "couldn't find you" })
        }

    } catch (e) {
        res.status(400).send({ success: false, message: "couldn't updated" })
    }
})

app.post("/getUser", async (req, res) => {
    const { number } = req.body;
    try {
        const user = await userModel.findOne({ bcryptPassword: number });
        res.status(200).send({ success: true, user });
    } catch (e) {
        res.status(400).send({ success: false, user: "" });
    }
});

app.post("/getAdminUser", async (req, res) => {
    const { number } = req.body;
    try {
        const user = await userModel.findOne({ number });
        res.status(200).send({ success: true, user });
    } catch (e) {
        res.status(400).send({ success: false, user: "" });
    }
});

app.post("/setWallet", async (req, res) => {
    const { wallet, number } = req.body;
    try {
        const user = await userModel.findOne({ number });
        if (user) {
            const previousWallet = user.wallet; // Store previous wallet amount
            user.wallet = wallet;

            const tracker = {
                userName: user.name,
                number: user.number,
                time: Date.now(),
                amount: wallet - previousWallet // Correct amount calculation
            };

            const track = await trackModel.create(tracker);
            await user.save();
        }

        res.status(200).send({ success: true });
    } catch (e) {
        console.error(e); // Log the error for debugging
        res.status(400).send({ success: false, error: e.message });
    }
});


app.post("/verifyUser", async (req, res) => {
    const { number, password } = req.body;

    try {
        // Find user by mobile number
        const user = await userModel.findOne({ number });

        if (!user) {
            return res.status(400).send({ success: false, message: "Phone number is not registered." });
        }

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.bcryptPassword);

        if (!isPasswordValid) {
            return res.status(400).send({ success: false, message: "Incorrect password." });
        }

        // If password is valid, send success response
        res.status(200).send({ success: true, message: "User verified.", user });
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).send({ success: false, message: "An error occurred. Please try again later.", user: null });
    }
});


app.get("/lotteryData", async (req, res) => {
    try {
        // Fetch all lottery data
        let response = await lotteryModel.find();

        // If no data exists, insert the default data
        if (response.length === 0) {
            response = await lotteryModel.insertMany(data);
            return res.status(200).send(response);
        }

        // Get today's date
        const dat = new Date();
        const day = dat.getDate();
        const month = dat.getMonth() + 1; // Months are 0-indexed
        const date = `${day}/${month}`;

        // Check if today's date is already present in winningNumber
        let updated = false;
        response.forEach((entry) => {
            entry.winningNumber.forEach((number) => {
                if (number.date === date) {
                    updated = true;
                }
            });
        });

        // If the data is already updated for today, return the response
        if (updated) {
            return res.status(200).send(response);
        }

        // Update the data for today's date
        await Promise.all(
            response.map(async (entry) => {
                entry.winningNumber.push({ open: "***", jodi: "**", close: "***", date, status: "RUNNING" });

                // Ensure only the latest 5 entries are kept
                if (entry.winningNumber.length > 5) {
                    entry.winningNumber.shift();
                }

                await entry.save(); // Save the updated entry
            })
        );

        // Fetch the updated data
        const updatedResponse = await lotteryModel.find();

        const alluser= await userModel.find();
        alluser.forEach((user)=>{
            user.bet.forEach((bett)=>{
                bett.status= true;
            })
        });

        await alluser.save();

        return res.status(200).send(updatedResponse);

    } catch (error) {
        console.error("Error fetching or updating lottery data:", error);
        return res.status(500).send({ error: "Internal server error" });
    }
});





const calculateJodiFirstDigit = (open) => {

    const digitSum = open
        .split("")
        .map(Number)
        .reduce((sum, digit) => sum + digit, 0);

    const digit = digitSum.toString();

    let firstDigit;

    if (digit.length == 1) {
        firstDigit = digit.charAt(0);
    } else {
        firstDigit = digit.charAt(1);
    }


    return firstDigit;
};

app.post("/setStatus", async(req, res)=>{
    const {lotteryName, typee}= req.body;
    const dataa= await lotteryModel.findOne({lotteryName});
    if(dataa){
        if(typee==="open"){
            dataa.winningNumber.status("OPENED");
        }else if(typee==="close"){
            dataa.winningNumber.status("CLOSED");
        }
        
        await dataa.save();
    }else{
        console.log("could not find data");
    }
})

app.post("/submitData", async (req, res) => {
    try {
      const { lotteryName, lotteryData } = req.body;
  
      // Validate input data
      if (!lotteryName || !lotteryData) {
        return res.status(400).send({
          success: false,
          message: "Invalid input data.",
        });
      }
  
      const currentDate = new Date();
      const date = `${currentDate.getDate()}/${currentDate.getMonth() + 1}`;
  
      // Fetch lottery data
      const findData = await lotteryModel.findOne({ lotteryName });
      if (!findData) {
        return res.status(404).send({
          success: false,
          message: "Lottery not found.",
        });
      }
  
      // Find the winning entry for the current date
      const winningNumberEntry = findData.winningNumber.find(
        (entry) => entry.date === date
      );
      if (!winningNumberEntry) {
        return res.status(404).send({
          success: false,
          message: "Winning entry for the current date not found.",
        });
      }
  
      let jodiDigit = "--"; // Placeholder for jodi digits
  
      // Process "open" data
      if (lotteryData.open) {
        winningNumberEntry.open = lotteryData.open;
        
        const firstNumber = calculateJodiFirstDigit(lotteryData.open);
        jodiDigit = firstNumber + jodiDigit[1]; 

        winningNumberEntry.jodi = jodiDigit;
        // Payout for "open" bets
        await giveMoney(lotteryName, "open", lotteryData.open, "oddeven", 9.6, 0, 1);
        await giveMoney(lotteryName, "open", lotteryData.open, "singleDigit", 9.8, 2, 1);
        await giveMoney(lotteryName, "open", lotteryData.open, "singlepanna", 151, 0, 3);
        await giveMoney(lotteryName, "open", lotteryData.open, "doublepanna", 302, 0, 3);
        await giveMoney(lotteryName, "open", lotteryData.open, "triplepanna", 700, 0, 3);
        await giveMoney(lotteryName, "open", lotteryData.open, "singlepatti", 9.6, 0, 1);
        await giveMoney(lotteryName, "open", lotteryData.open, "doublepatti", 302, 0, 3);
      }
  
      
      if (lotteryData.close) {
        winningNumberEntry.close = lotteryData.close;
    
        const secondNumber = calculateJodiFirstDigit(lotteryData.close);
        jodiDigit = winningNumberEntry.jodi[0] + secondNumber; 
        winningNumberEntry.jodi = jodiDigit;
  
       
        await giveMoney(lotteryName, "open", jodiDigit, "jodidight", 96, 0, 2);
        await giveMoney(lotteryName, "open", jodiDigit, "redbracket", 96, 0, 2);
        await giveMoney(lotteryName, "open", jodiDigit, "jodifamily", 96, 0, 2);
  
        await giveMoney(lotteryName, "close", lotteryData.close, "oddeven", 9.6, 0, 1);
        await giveMoney(lotteryName, "close", lotteryData.close, "singleDigit", 9.6, 2, 1);
        await giveMoney(lotteryName, "close", lotteryData.close, "doublepanna", 302, 0, 3);
        await giveMoney(lotteryName, "close", lotteryData.close, "triplepanna", 700, 0, 3);
        await giveMoney(lotteryName, "close", lotteryData.close, "singlepatti", 9.6, 0, 1);
        await giveMoney(lotteryName, "close", lotteryData.close, "doublepatti", 302, 0, 3);
  
        
        await giveMoneyToSangam(lotteryName, winningNumberEntry.open, lotteryData.close, "halfsangam", "close", 1000 , 0);
        await giveMoneyToSangam(lotteryName, winningNumberEntry.open, lotteryData.close, "fullsangam", "close", 10000 , 0);
  
        await giveMoneyToSangam(lotteryName, lotteryData.close, winningNumberEntry.open, "halfsangam", "open", 1000, 2 );
        await giveMoneyToSangam(lotteryName, lotteryData.close, winningNumberEntry.open, "fullsangam", "open", 10000, 2 );
      }
  
      // Save updated data
      await findData.save();
  
      return res.status(200).send({
        success: true,
        message: "Successfully updated.",
      });
    } catch (error) {
      console.error("Error while submitting data:", error);
      res.status(500).send({
        success: false,
        message: "Internal server error.",
      });
    }
  });
  


app.post("/setBet", async (req, res) => {
    const { fixBet, number } = req.body;
    const user = await userModel.findOne({ bcryptPassword: number });
    if (user) {
        let total = 0;
        fixBet.forEach((singleBet) => {
            if (singleBet.amount !== "" && singleBet.amount >=10) {
                user.bet.push(singleBet);
                total += singleBet.amount;
            }
        });
        user.wallet -= total;
        await user.save();
        res.status(200).send({ success: true, message: "Bet placed" })
    } else {
        res.status(200).send({ success: false, message: "User not found" })
    }
})

app.use(errorHandler);

app.listen(port, () => {
    console.log(`app is listening on ${port}`)
})