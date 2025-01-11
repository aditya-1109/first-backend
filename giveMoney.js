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