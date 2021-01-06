// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

function fizzBuzzGame(val){
    let val;
    if (val % 15 === 0){
        val = "Fizz Buzz"
    } else if (val % 3 === 0){
        val = "Fizz"
    } else if (val % 5 === 0){
        val = "Buzz"
    } else {
        val = `${val}`;
    }
    return val;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Fizz Buzz. We’ll each take turns counting up from one. However, you must replace numbers divisible by 3 with the word “fizz” and you must replace numbers divisible by 5 with the word “buzz”. If a number is divisible by both 3 and 5, you should instead say “fizz buzz”. If you get one wrong, you lose.'';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PlayIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayIntent'
        ;
    },
    handle(handlerInput){
        // const request = handlerInput.requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
       
        sessionAttributes['count'] = 1;
      
        const speakOutput = 'Ok, I will start. one' ;
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
};

const FizzBuzzIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FizzBuzzIntent';
    },
    handle(handlerInput) {
        
        const request = handlerInput.requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      
        const userNum = parseInt(Alexa.getSlotValue(handlerInput.requestEnvelope, 'number'),10);
        const userWord = Alexa.getSlotValue(handlerInput.requestEnvelope, 'word');

  
        sessionAttributes['count'] = 1;

        let prevVal = sessionAttributes['count'];
        let currentVal = prevVal + 1;
        let correctAnswer = fizzBuzzGame(currentVal);

        let say = '';
        
        if (userNum === correctAnswer || userWord === correctAnswer){
            sesssionAttributes['count'] = currentVal + 1;
            return handlerInput.responseBuilder
            .speak(fizzBuzzGame(currentVal + 1))
            .reprompt(say)
            .getResponse();
        }
        else {
            // const correctAnswer = val;
            say = `Wrong. the correct answer was ${fizzBuzzGame(correctAnswer)}`;
            return  handlerInput.responseBuilder
            .speak(say)
            .reprompt(say)
            .getResponse();
        }
        
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
