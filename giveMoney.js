
import { userModel } from "./userSchema.js";

export const giveMoney = async (lotteryName, type, digit, bidType, multiplier, digitIndex, numbers, date) => {
  try {
      const winners = await userModel.aggregate([
          { $unwind: "$bet" },
          {
              $match: {
                  "bet.betName": lotteryName,
                  "bet.betType": type,
                  "bet.bidName": bidType,
                  "bet.date": date, // Ensure date matches
                  $expr: {
                      $eq: [
                          { $toInt: { $substr: [digit, digitIndex, numbers] } }, 
                          "$bet.digit"
                      ]
                  }
              }
          }
      ]);

      if (!winners.length) {
          console.log("No winners found for", lotteryName, type, bidType);
          return;
      }

      const bulkOperations = [];

      for (const winner of winners) {
          const user = await userModel.findById(winner._id);
          if (!user) continue; // Skip if user is not found

          let totalWinnings = 0;

          for (const userBet of user.bet) {
              if (
                  userBet.betName === lotteryName &&
                  userBet.betType === type &&
                  userBet.date === date && // Ensure date matches
                  (userBet.digit === parseInt(digit.charAt(digitIndex)) || userBet.digit === parseInt(digit)) &&
                  userBet.bidName === bidType
              ) {
                  totalWinnings += userBet.amount * multiplier; // Calculate total winnings
              }
          }

          if (totalWinnings > 0) {
              bulkOperations.push({
                  updateOne: {
                      filter: { _id: user._id },
                      update: { $inc: { wallet: totalWinnings } } // Add winnings in one update
                  }
              });
          }
      }

      // Perform batch update for efficiency
      if (bulkOperations.length > 0) {
          await userModel.bulkWrite(bulkOperations);
          console.log(`${bulkOperations.length} users updated successfully.`);
      }
  } catch (error) {
      console.error("Error in giveMoney:", error);
  }
};


export const giveMoneyToSangam = async (lotteryName, closeDigit, openDigit, bidType, betType, multiplier, index ) => {
    try {
      const isHalfSangam = bidType === "halfsangam";

      const baseMatchConditions = {
        "bet.betName": lotteryName,
        "bet.betType": betType,
        "bet.status": false,
        "bet.bidName": bidType,
      };
  
      
      const extraConditions = isHalfSangam
        ? {
            $expr: {
              $and: [
                { $eq: [{ $toInt: openDigit }, "$bet.digit"] },
                { $eq: [{ $toInt: { $substr: [closeDigit, index, 1] } }, "$bet.sangam"] },
              ],
            },
          }
        : {
            $expr: {
              $and: [
                { $eq: [{ $toInt: openDigit }, "$bet.digit"] },
                { $eq: [{ $toInt: closeDigit }, "$bet.sangam"] },
              ],
            },
          };
  
      const winners = await userModel.aggregate([
        { $unwind: "$bet" },
        { $match: { ...baseMatchConditions, ...extraConditions } },
      ]);

  


      for (const winner of winners) {
        const { _id } = winner;
  
        const user = await userModel.findById(_id);
        if (!user) {
          console.warn(`User with ID ${_id} not found`);
          continue;
        }
  
        let updated = false;
  
        // Iterate through bets and update the winning ones
        for (const userBet of user.bet) {
          const isWinningBet =
            userBet.betName === lotteryName &&
            userBet.betType === betType &&
            userBet.digit === parseInt(openDigit) &&
            userBet.sangam ===
              (isHalfSangam ? parseInt(closeDigit.charAt(index)) : parseInt(closeDigit)) &&
            userBet.bidName === bidType &&
            !userBet.status;
  
          if (isWinningBet) {
            const winnings = userBet.amount * multiplier;
            user.wallet += winnings;
            userBet.status = true;
            updated = true;
          }
        }
  

        if (updated) {
          await user.save();
        }
      }
    } catch (error) {
      console.error("Error in giveMoneyToSangam:", error);
    }
  };
  