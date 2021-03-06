'use strict'
const dialogflow = require('dialogflow');
const structjson= require('./structjson.js');
const config = require('../config/keys');
const {struct} = require('pb-util');


const projectID= config.googleProjectID;
const sessionID = config.dialogFlowSessionID;
const languageCode = config.dialogFlowSessionLanguageCode;

const credentials={
  client_email:config.googleClientEmail,
  private_key:config.googlePrivateKey
};

const sessionClient = new dialogflow.SessionsClient({projectID, credentials});



module.exports={
  textQuery: async function(text,userID, parameters= {}){
    let sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
    let self= module.exports;
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text:text,
                languageCode: config.dialogFlowSessionLanguageCode
              },
            },
            queryParams:{
              payload:{
                data:parameters
              }
        }
    };
    let responses= await sessionClient.detectIntent(request);
    responses= await self.handleActions(responses);
    return responses;
  },
  eventQuery: async function(event,userID, parameters= {}){
      let sessionPath = sessionClient.sessionPath(projectID, sessionID + userID);
      let self= module.exports;
    const request = {
        session: sessionPath,
        queryInput: {
            event: {
                name:event,
                parameters:structjson.jsonToStructProto(parameters),
                languageCode: config.dialogFlowSessionLanguageCode
              },
            }
    };
    let responses= await sessionClient.detectIntent(request);
    responses= await self.handleActions(responses);
    return responses;
  },
  handleActions: function(responses){
    return responses;
  }
}
