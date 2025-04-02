
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
          "bet.date": date,
          $expr: {
            $eq: [
              "$bet.digit",
              {
                $toInt: {
                  $substrCP: [digit, digitIndex, numbers] // More reliable for handling substrings
                }
              }
            ]
          }
        }
      }
    ]);

    if (!winners.length) {
      console.log("No winners found for", lotteryName, type, bidType);
      return;
    }

    const bulkOperations = winners.map((winner) => {
      const winningAmount = winner.bet.amount * multiplier;
      return {
        updateOne: {
          filter: { _id: winner._id },
          update: { $inc: { wallet: winningAmount } } // Increment wallet balance
        }
      };
    });

    if (bulkOperations.length > 0) {
      await userModel.bulkWrite(bulkOperations);
      console.log("Wallets updated successfully!");
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
  