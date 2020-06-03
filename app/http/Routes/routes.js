const server = require('../Server');
const AuthMiddleware = require('../../Middlewares/AuthMiddleware');
const { BotService } = require('../../Services/Bots/BotService');
const SetAdapter = require('../../Services/Adapter/SetAdapter');
const { appId, appPassword } = require('../../../config/Config');

// This route will start a new thread
server.post('/api/thread', AuthMiddleware, async (request, response) => {
    try {
        const MiscrosoftBotService = new BotService(request);
        const threadData = await MiscrosoftBotService.startNewThread();
        response.send(200, threadData);
    } catch (e) {
        response.send(500, {"error": e});
    }
});

// This route will send a reply
server.post('/api/reply', AuthMiddleware, async (request, response) => {
    try {
        const MiscrosoftBotService = new BotService(request);
        await MiscrosoftBotService.reply();
        response.send(200, {'message': 'Reply Sent'});
    } catch (e) {
        response.send(500, {"error": e.message});
    }
});

// Listen for incoming requests.
server.post('/api/messages', (request, response) => {
    const adapter = SetAdapter.setAdapter(appId, appPassword);
    adapter.processActivity(request, response, async (context) => {
        await bot.run(context);
    });
});
