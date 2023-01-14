import reserve from './reserve';

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    reserve(context);
    context.log('JavaScript timer trigger function ran!', timeStamp);   
};