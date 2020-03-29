import * as functions from 'firebase-functions';
import { dialogflow } from 'actions-on-google';

import { Station } from './models';
import { fetchAristocratsApi } from './services';
import { getMessage } from './helpers';

const WELCOME_INTENT = 'Default Welcome Intent';
const STATION_INTENT = 'Station Number';

const app = dialogflow({ debug: true });
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

/* export const _nowplaying = functions.https.onCall(async (data = {}, context) => {
  const station = data['station'] || AStations.Aristocrats;
  const res = await fetchAristocratsApi(station);
  return {
    message: getMessage(res),
  };
}); */

async function handler(station = Station.Aristocrats) {
  const res = await fetchAristocratsApi(station);
  const message = getMessage(res);
  return message;
}

export const nowplaying = functions.https.onRequest(app);
