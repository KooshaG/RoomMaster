import { AzureFunction, Context } from "@azure/functions"
import reserve from "./reserve";

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();
    context.log('Timer trigger function called:', timeStamp);   
    
    if (myTimer.isPastDue)
    {
        context.log('Timer function is running late!');
    }
    // reserve(context).then(() => {
    //     timeStamp = new Date().toISOString();
    //     context.log('Timer trigger function ended:', timeStamp);   
    // })
    setTimeout(() => {context.log('Timer trigger function ended')}, 10000)
};

export default timerTrigger;
