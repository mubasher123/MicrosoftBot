const { BotFrameworkAdapter } = require('botbuilder');

class SetAdapter {
    static setAdapter(appId, appSecret){
        const adapter = new BotFrameworkAdapter({
            appId: appId,
            appPassword: appSecret
        });
        
        adapter.onTurnError = async (context, error) => {
            // This check writes out errors to console log .vs. app insights.
            // NOTE: In production environment, you should consider logging this to Azure
            //       application insights.
            console.error(`\n [onTurnError] unhandled error: ${ error }`);
            console.log('Context On Error: ', context);
        
            // Send a trace activity, which will be displayed in Bot Framework Emulator
            await context.sendTraceActivity(
                'OnTurnError Trace',
                `${ error }`,
                'https://www.botframework.com/schemas/error',
                'TurnError'
            );
        
            // Send a message to the user
            await context.sendActivity('The bot encountered an error or bug.');
            await context.sendActivity('To continue to run this bot, please fix the bot source code.');
        };
        return adapter;
    }
}



module.exports = SetAdapter;