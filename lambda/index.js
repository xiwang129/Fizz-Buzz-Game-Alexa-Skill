
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        var introSound = '<audio src="soundbank://soundlibrary/alarms/chimes_and_bells/chimes_bells_04"/>';
        const speakOutput = `${introSound} Welcome to Fizz Buzz. We’ll each take turns counting up from one. However, you must replace numbers divisible by 3 with the word “fizz” and you must replace numbers divisible by 5 with the word “buzz”. If a number is divisible by both 3 and 5, you should instead say “fizz buzz”. If you get one wrong, you lose. Say begin to start`;
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

        let speakOutput = '';
        
        if (userNum === correctAnswer || userWord === correctAnswer){
            sesssionAttributes['count'] = currentVal + 1;
            return handlerInput.responseBuilder
            .speak(fizzBuzzGame(currentVal + 1))
            .reprompt(say)
            .getResponse();
        }
        else {
            // const correctAnswer = val;
            var buzzer = '<audio src="soundbank://soundlibrary/alarms/buzzers/buzzers_02"/>';
            let speakOutput = `${buzzer} the correct answer was ${fizzBuzzGame(correctAnswer)}. Say yes to play again or st
            return  handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        }
        
    }
};

const ScoreIntentHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ScoreIntent'
        ;
    },
    handle(handlerInput){
        // const request = handlerInput.requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
       
        let prevVal = sessionAttributes['count'];
        let currentVal = prevVal + 1;
        let correctAnswer = fizzBuzzGame(currentVal);

        let score = fizzBuzzGame(correctAnswer);
        var scoreSound = '<audio src="soundbank://soundlibrary/musical/amzn_sfx_trumpet_bugle_04"/>';
      
        let speakOutput = '';
        if (score > 5){
            speakOutput = `${scoreSound}Congrats, you achieved level 1`;
            
        }else if (6 < score < 10){
            speakOutput = `${scoreSound}Congrats, you achieved level 2`;
            
        }else if (11 < score < 20){
            speakOutput = `${scoreSound}Congrats, you achieved level 3`;
            
        }else{
            speakOutput =`${scoreSound}You achieved the highest level!`;}
      
        return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
    }
};






const NavigateHomeIntentHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent';
    },
    handle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      const responseBuilder = handlerInput.responseBuilder;
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  
      let say = 'Hello from AMAZON.NavigateHomeIntent. ';
  
  
      return responseBuilder
        .speak(say)
        .reprompt('try again, ' + say)
        .getResponse();
    },
  };
  
  const FallbackIntentHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      const responseBuilder = handlerInput.responseBuilder;
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  
      let previousSpeech = getPreviousSpeechOutput(sessionAttributes);
  
      return responseBuilder
        .speak('Sorry I didnt catch what you said, ' + stripSpeak(previousSpeech.outputSpeech))
        .reprompt(stripSpeak(previousSpeech.reprompt))
        .getResponse();
    },
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
        PlayIntentHandler,
        ScoreIntentHandler,
        FizzBuzzIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();


=====================================

function fizzBuzzGame(val){
    let val;
    if (val % 15 === 0){
        val = "fizz buzz"
    } else if (val % 3 === 0){
        val = "fizz"
    } else if (val % 5 === 0){
        val = "buzz"
    } else {
        val = `${val}`;
    }
    return val;
}

function stripSpeak(str) {
  return (str.replace('<speak>', '').replace('</speak>', ''));
}


function getPreviousSpeechOutput(attrs) {

  if (attrs.lastSpeechOutput && attrs.history.length > 1) {
    return attrs.lastSpeechOutput;

  } else {
    return false;
  }

}

