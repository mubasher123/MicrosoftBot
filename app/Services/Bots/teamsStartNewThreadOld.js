// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    TurnContext,
    MessageFactory,
    TeamsActivityHandler,
    teamsGetChannelId
} = require('botbuilder');
const { MicrosoftAppCredentials } = require('botframework-connector');
const url = "https://smba.trafficmanager.net/apac/";
MicrosoftAppCredentials.trustServiceUrl(url);

// https://teams.microsoft.com/l/message/19:d51c54afeff04018bf84af91f0b1d7c7@thread.tacv2/1589398710499?tenantId=c4b9ca2f-b7cc-499c-8c3a-df34994784f3&groupId=973caad3-2cd4-48d0-a319-3b3a26a33f44&parentMessageId=1589398710499&teamName=octek.co&channelName=General&createdTime=1589398710499

class TeamsStartNewThreadOld extends TeamsActivityHandler {
    constructor(conversationReferences, activityGlobal, teamsChannelId) {
        super();

        // Dependency injected dictionary for storing ConversationReference objects used in NotifyController to proactively message users
        this.conversationReferences = conversationReferences;
        this.activityGlobal = activityGlobal;
        this.teamsChannelId = teamsChannelId;

        this.onConversationUpdate(async (context, next) => {
            this.addConversationReference(context.activity);
            //console.log('this.conversationReferences: ',this.conversationReferences);
            await next();
        });

        this.onMessage(async (context, next) => {
            this.activityGlobal = context.activity;
            console.log('this.activityGlobal: ', this.activityGlobal);
            this.teamsChannelId = teamsGetChannelId(context.activity);
            //console.log(this.teamsChannelId);
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            console.log('on Joined channel');
            await next();
        });
        this.onMembersRemoved(async (context, next) => {
            console.log('on removed member');
            await next();
        });
        this.onTyping(async (context, next) => {
            console.log('on typing');
            await next();
        });
    }

    addConversationReference(activity) {
        const conversationReference = TurnContext.getConversationReference(activity);
        this.conversationReferences[conversationReference.conversation.id] = conversationReference;
    }

    async createNewMessage(adapter) {
        const message = MessageFactory.text('New Ticket created');
        const conversationParameters = {
            isGroup: true,
            channelData: {
                channel: {
                    id: "19:d51c54afeff04018bf84af91f0b1d7c7@thread.tacv2"
                }
            },

            activity: message
        };
        const connectorClient = adapter.createConnectorClient(url);
        const conversationResourceResponse = await connectorClient.conversations.createConversation(conversationParameters);
        return conversationResourceResponse;
    }

    async replyToConversation(lastConversation, adapter) {
        return await adapter.continueConversation(lastConversation,
            async (t) => {
                await t.sendActivity(MessageFactory.text('Reply to ticket thread'));
            });
    }
}

module.exports.TeamsStartNewThreadInChannel = TeamsStartNewThreadOld;
