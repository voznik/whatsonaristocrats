import * as functions from 'firebase-functions';
import { dialogflow } from 'actions-on-google';

import { Station } from './models';
import { fetchAristocratsApi } from './services';
import { getMessage } from './helpers';

const app = dialogflow({ debug: true });

app.intent('Default Welcome Intent', async conv => {
  const { station } = conv.parameters;
  // Complete your fulfillment logic and
  // send a response when the function is done executing
  const res = await fetchAristocratsApi(station as Station);
  const message = getMessage(res);
  conv.close(message);
});

/* export const _nowplaying = functions.https.onCall(async (data = {}, context) => {
  const station = data['station'] || AStations.Aristocrats;
  const res = await fetchAristocratsApi(station);
  return {
    message: getMessage(res),
  };
}); */

export const nowplaying = functions.https.onRequest(app);
