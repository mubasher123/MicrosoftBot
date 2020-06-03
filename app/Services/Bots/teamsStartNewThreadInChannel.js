const { TeamsActivityHandler, ActivityTypes } = require('botbuilder');
const { MicrosoftAppCredentials } = require('botframework-connector');

class TeamsStartNewThreadInChannel extends TeamsActivityHandler {
    
    /**
     * Constructor
     * @param {*} serviceUrl 
     */
    constructor(serviceUrl) {
        super();
        this.serviceUrl = serviceUrl;
        MicrosoftAppCredentials.trustServiceUrl(this.serviceUrl);
    }

    /**
     * It will create a new thread in the channel with attachments or textMessage
     * @param {*} adapter 
     * @param {*} channelId 
     * @param {*} attachments 
     * @param {*} textMessage 
     */
    async createNewThread(adapter, channelId, attachments, textMessage) {
        const message = { type: ActivityTypes.Message };
        if (attachments.length) {
            message.attachments = attachments;
        } 
        if (textMessage !== '') {
            message.text = textMessage;
        }
        const conversationParameters = {
            isGroup: true,
            channelData: {
                channel: {
                    id: channelId
                }
            },

            activity: message
        };
        const connectorClient = adapter.createConnectorClient(this.serviceUrl);
        return await connectorClient.conversations.createConversation(conversationParameters);
    }

    /**
     * It will add reply to the thread
     * @param {*} adapter 
     * @param {*} replyData 
     * @param {*} attachments 
     * @param {*} textMessage 
     */
    async replyToConversation(adapter, replyData, attachments, textMessage) {
        const reply = { type: ActivityTypes.Message };
        reply.text = textMessage;
        if (attachments.length) {
            reply.attachments = attachments;
        }
        return await adapter.continueConversation(replyData,
            async (t) => {
                return await t.sendActivity(reply);
            });
    }
}

module.exports.TeamsStartNewThreadInChannel = TeamsStartNewThreadInChannel;
