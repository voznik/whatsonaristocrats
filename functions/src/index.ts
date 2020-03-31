import * as functions from 'firebase-functions';
import { dialogflow } from 'actions-on-google';
import * as i18n from 'i18n';

import * as INTENT from './constants/intent';
import {
  Station,
  NowPlayingInfo,
  NowplayingCard,
  LinkOpenMusic,
} from './models';
import { fetchAristocratsApi } from './services';

i18n.configure({
  locales: ['en-US', 'ru-RU'],
  directory: `${__dirname}/locales`,
  defaultLocale: 'en-US',
});

const app = dialogflow({ debug: true });

app.middleware(conv => {
  // IETF BCP-47 language code
  const locale = conv.user?.locale || conv.request.user?.locale;
  if (locale) {
    i18n.setLocale(locale);
    console.log('DEBUG: current locale', i18n.getLocale());
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
  // let message;
  switch (intent) {
    case INTENT.WELCOME_INTENT: {
      conv.ask(`Searching ...`);
      const { message, query } = await handler(parameters.station as Station);
      if (query) {
        conv.ask(
          new NowplayingCard(`Here's what's on the air:`, message, query)
        );
        conv.ask(new LinkOpenMusic('Music', query));
      } else {
        conv.close(message);
      }
      break;
    }
    case INTENT.STATION_INTENT:
      conv.ask(i18n.__('STATION'));
      break;
    default: {
      const { message } = await handler();
      conv.close(message);
    }
  }
});

async function handler(station = Station.Aristocrats) {
  const data = await fetchAristocratsApi(station);
  const model = new NowPlayingInfo(data);
  const message = model.getMessage();
  const query = model.getSearchString();
  // console.log('DEBUG: handler -> message', { message });
  return { message, query };
}

// The entry point to handle a http request
export const nowplaying = functions.region('europe-west2').https.onRequest(app);
// For testing purposes
export const testApp = app;
