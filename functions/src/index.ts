import * as functions from 'firebase-functions';
import { dialogflow } from 'actions-on-google';

import { isEmptyObject } from './helpers';
import { Station } from './models';
import { fetchAristocratsApi } from './services';

const WELCOME_INTENT = 'Default Welcome Intent';
const STATION_INTENT = 'Station Number';
const app = dialogflow({ debug: true });

app.middleware(conv => {
  if (!isEmptyObject(conv.data)) {
    // Convert array of facts to map
    console.log(`DEBUG: 'conv.data'`, conv.data);
  }
});
// The following example shows a simple catch error handler that sends the error to console output and sends back a simple string response to prompt the user via the conv.ask() function:
app.catch((conv, error) => {
  console.error({ error });
  conv.ask('I encountered a glitch. Can you say that again?');
});
// you can add a fallback function instead of a function for individual intents
app.fallback(async conv => {
  // intent contains the name of the intent
  // you defined in the Intents area of Dialogflow
  const intent = conv.intent;
  let message = `There is nothing playing at the moment. You can check again later.
  Thank you!`;
  switch (intent) {
    case WELCOME_INTENT:
      message = await handler();
      conv.close(message);
      break;
    case STATION_INTENT:
      message = await handler();
      conv.ask('What station are you listening');
      break;
    default:
      message = await handler();
      conv.close(message);
  }
});

async function handler(station = Station.Aristocrats) {
  const res = await fetchAristocratsApi(station);
  const message = res.getMessage();
  console.log('DEBUG: handler -> message', message);
  return message;
}

// The entry point to handle a http request
export const nowplaying = functions.region('europe-west2').https.onRequest(app);
// For testing purposes
export const testApp = app;
