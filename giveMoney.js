
import { userModel } from "./userSchema.js";

export const giveMoney = async (lotteryName, type, digit, bidType, multiplier, digitIndex, numbers) => {
    const winners = await userModel.aggregate([
        { $unwind: "$bet" },
        {
            $match: {
                "bet.betName": lotteryName,
                "bet.betType": type,
                "bet.status": false,
                "bet.bidName": bidType,
                $expr: {
                    $eq: [
                        { $toInt: { $substr: [digit, digitIndex, numbers] } }, 
                        "$bet.digit"
                    ]
                }
            }
        }
    ]);

    for (const winner of winners) {
        const { _id } = winner;

       
        const user = await userModel.findById(_id);
        let updated = false;

        for (const userBet of user.bet) {
            if (
                userBet.betName === lotteryName &&
                userBet.betType === type &&
                userBet.digit === (parseInt(digit.charAt(digitIndex)) || parseInt(digit)) && 
                userBet.bidName === bidType &&
                !userBet.status
            ) {
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
};

export const giveMoneyToSangam = async (
    lotteryName,
    closeDigit,
    openDigit,
    bidType,
    betType,
    multiplier,
    index
  ) => {
    try {
      const isHalfSangam = bidType === "halfsangam";
  
      
      const baseMatchConditions = {
        "bet.betName": lotteryName,
        "bet.betType": betType,
        "bet.status": false,
        "bet.bidName": bidType,
      };
  
      // Add specific match conditions based on bidType
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
  
      // Process winners
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
            parseInt(userBet.digit) === parseInt(openDigit) &&
            parseInt(userBet.sangam) ===
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
  