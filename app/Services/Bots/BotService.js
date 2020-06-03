const SetAdapter = require('../Adapter/SetAdapter');
const { TeamsStartNewThreadInChannel } = require('./teamsStartNewThreadInChannel');

class BotService
{
    /**
     * Constructor
     * @param {*} headers 
     * @param {*} body 
     */
    constructor(request) {
        this.body = request.body;
        this.appId = request.headers.authData.appId;
        this.appPassword = request.headers.authData.appPassword;
        this.adapter = SetAdapter.setAdapter(this.appId, this.appPassword);
    }

    /**
     * It will start a new thred in the channel
     */
    async startNewThread() {
        const attachments = this.getAttachments();
        const textMessage = this.getMessageText();
        const bot = new TeamsStartNewThreadInChannel(this.body.serviceUrl);

        //When both text and attachments are available in the request 
        if (attachments.length && textMessage !== '') {
            const thread = await bot.createNewThread(
                this.adapter, 
                this.body.channelId,
                [],
                textMessage
            );
            const replyData = this.getReplyDataFromThreadResponse(thread);
            await bot.replyToConversation(this.adapter, replyData, attachments, '');
            return thread;
        }
        //When just text message is present in the request to create new thread
        if (textMessage !== '' && !attachments.length) {
            return await bot.createNewThread(
                this.adapter, 
                this.body.channelId,
                [],
                textMessage
            );
        }
        //When just attachments are present to create new thread
        if (attachments.length && textMessage === '') {
            if (attachments.length > 1) {
                throw 'Could not post multiple attachments in thread creation';
            }
            return await bot.createNewThread(
                this.adapter, 
                this.body.channelId,
                attachments,
                ''
            );
        }
        
        throw 'Request data is missing';
    }

    /**
     * It will send reply in the conversation
     */
    async reply() {
        const attachments = this.getAttachments();
        const bot = new TeamsStartNewThreadInChannel(this.body.replyData.serviceUrl);
        return await bot.replyToConversation(this.adapter, this.body.replyData, attachments, this.body.message);
    }

    /**
     * It will return the attachments
     */
    getAttachments() {
        let attachments = [];
        if (this.body.attachments && this.body.attachments.length) {
            attachments = this.body.attachments;
        }
        return attachments;
    }

    /**
     * It will return the text message
     */
    getMessageText() {
        let message = '';
        if (this.body.message && this.body.message !== '') {
            message = this.body.message;
        }
        return message;
    }

    /**
     * It returns the reply request data
     * @param {*} response 
     */
    getReplyDataFromThreadResponse(response) {
        return {
            activityId: response.activityId,
            conversation: {
                id: response.id
            },
            serviceUrl: this.body.serviceUrl
        };
    }
}

module.exports.BotService = BotService;