import { AzureFunction, Context } from "@azure/functions"
import { PrismaClient } from "@prisma/client";
import superagent = require("superagent");


// const url = "http://localhost:7071/api/ReservationForAUser"
const url = "https://reservation-service.azurewebsites.net/api/ReservationForAUser"

const timerTrigger: AzureFunction = async function (context: Context, myTimer: any): Promise<void> {
    var timeStamp = new Date().toISOString();
    context.log('Timer trigger function called:', timeStamp);
    const prisma = new PrismaClient();

    const time = new Date(Date.now() - (1000 * 60 * 60 * 12));
    const users = await prisma.user.findMany({where: {
        OR: [
            {lastRequestTime: {lte: time}},
            {lastRequestTime: null}
        ],
        verified: true
    }})

    context.log('Users:', users.map(user => user.loginUsername))

    users.forEach((user) => {
        return superagent.post(url).send({username: user.loginUsername}).on('error', () => context.log(`${user.loginUsername} error happened`)).then((res) => context.log(`${user.loginUsername} worked`))
    })
    
    if (myTimer.isPastDue)
    {
        context.log('Timer function is running late!');
    }
    // reserve(context).then(() => {
    //     timeStamp = new Date().toISOString();
    //     context.log('Timer trigger function ended:', timeStamp);   
    // })
    await prisma.$disconnect();
    context.log('Timer trigger function ended')
};

export default timerTrigger;
