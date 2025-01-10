const dat= new Date;
const day= dat.getDate();
const month= dat.getMonth() +1;
const date= `${day}/${month}`;


export const data= [{ initialTime: "8:45", finalTime:"9:45", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MAHAKAL MORNING", RemainingTime:"00:00:00"},
    { initialTime: "9:00 am", finalTime:"10:00 am", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "SRIDEVI MORNING", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "9:30 am", finalTime:"10:30 am", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "SUPREME MORNING", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "11:00 am", finalTime:"12:00 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "FUNNY MORNING", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "11:25 am", finalTime:"12:25 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "FAST MORNING", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "11:30 am", finalTime:"12:30 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "SRIDEVI", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "1:10 pm", finalTime:"2:10 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "TIME BAZAR", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "1:15 pm", finalTime:"2:15 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MAHAKAL DAY", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "1:30 pm", finalTime:"2:30 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MADHUR DAY", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "2:05 pm", finalTime:"3:05 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "FAST DAY", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "3:10 pm", finalTime:"5:10 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MILAN DAY", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "2:50 pm", finalTime:"3:50 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "FUNNY DAY", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "3:05 pm", finalTime:"5:05 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "RAJDHANI DAY", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "3:30 pm", finalTime:"5:30 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "SUPREME DAY", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "4:25 pm", finalTime:"5:25 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MAHAKAL EVENING", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "3:55 pm", finalTime:"5:55 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "KALYAN", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "6:30 pm", finalTime:"7:30 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "FUNNY EVENING", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "6:55 pm", finalTime:"7:55 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "FAST EVENING", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "7:10 pm", finalTime:"8:10 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "SRIDEVI NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "8:15 pm", finalTime:"9:15 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "FUNNY NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "8:30 pm", finalTime:"10:30 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "NIGHT TIME BAZAR", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "8:30 pm", finalTime:"10:30 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MADHUR NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "8:40 pm", finalTime:"10:40 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "SUPREME NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "9:10 pm", finalTime:"11:10 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MILAN NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "9:05 pm", finalTime:"10:05 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "FAST NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "9:35 pm", finalTime:"11:45 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "RAJDHANI NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "9:30 pm", finalTime:"11:30 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "KALYAN NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "9:53 pm", finalTime:"11:59 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MAIN BAZAR", status: "RUNNING", RemainingTime:"00:00:00"},
    { initialTime: "9:50 pm", finalTime:"10:50 pm", winningNumber: [{open: "***", jodi: "**", close: "***", date, status: "RUNNING"}], lotteryName: "MAHAKAL NIGHT", status: "RUNNING", RemainingTime:"00:00:00"},
  ];

  