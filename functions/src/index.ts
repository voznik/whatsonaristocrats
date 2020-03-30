import * as functions from 'firebase-functions';
import { dialogflow } from 'actions-on-google';
import * as i18n from 'i18n';

import * as INTENT from './constants/intent';
import { Station } from './models';
import { fetchAristocratsApi } from './services';

console.log('dirname', __dirname);

i18n.configure({
  locales: ['en-US', 'ru-RU'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en-US',
});

const app = dialogflow({ debug: true });

app.middleware(conv => {
  if (conv.user && conv.user.locale) {
    i18n.setLocale(conv.user.locale);
  }
});
// The following example shows a simple catch error handler that sends the error to console output and sends back a simple string response to prompt the user via the conv.ask() function:
app.catch((conv, error) => {
  console.error({ error });
  conv.ask(i18n.__('ERROR'));
});
// you can add a fallback function instead of a function for individual intents
app.fallback(async conv => {
  // intent contains the name of the intent
  // you defined in the Intents area of Dialogflow
  const { intent, parameters } = conv;
  let message;
  switch (intent) {
    case INTENT.WELCOME_INTENT:
      message = await handler(parameters.station as Station);
      conv.close(message);
      break;
    case INTENT.STATION_INTENT:
      message = await handler(parameters.station as Station);
      conv.ask();
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
