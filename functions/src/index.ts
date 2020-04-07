// tslint:disable: no-floating-promises
import { dialogflow, Suggestions, SimpleResponse } from 'actions-on-google';
import * as functions from 'firebase-functions';
import i18next from 'i18next';

import * as INTENT from './constants/intent';
import { RESOURCES } from './constants/resources';
import {
  NowPlayingInfo,
  RadioStation,
  RadioStationName,
  Station,
  LinkOutSuggestionFull,
} from './models';
import { StationFactory } from './services';

i18next.init({
  fallbackLng: 'en-US',
  debug: true,
  resources: RESOURCES,
});

const app = dialogflow({ debug: true });
let stationInstance: Station;

app.middleware((conv) => {
  // IETF BCP-47 language code
  const locale = conv.user?.locale || conv.request.user?.locale;
  if (locale) {
    i18next.changeLanguage(locale).then((t) => {
      console.log('DEBUG: current locale', t);
    });
  }
});
// The following example shows a simple catch error handler that sends the error to console output and sends back a simple string response to prompt the user via the conv.ask() function:
app.catch((conv, error) => {
  console.error({ error });
  conv.ask(i18next.t('ERROR'));
});
// you can add a fallback function instead of a function for individual intents
app.fallback(async (conv) => {
  // intent contains the name of the intent
  // you defined in the Intents area of Dialogflow
  const { intent, parameters } = conv;
  const { station } = parameters;
  let ssml;
  switch (intent) {
    case INTENT.WELCOME_INTENT: {
      const { message, query } = await handler(
        parameters.station as RadioStationName
      );
      if (query) {
        const speech = `<speak><p><s>${i18next.t('FOUND_TITLE', {
          station,
        })}</s><break time="1"/><s>${message}</s></p></speak>`;
        const text = `${i18next.t('FOUND_TITLE', { station })}${message}`;
        conv.ask(new SimpleResponse({ speech, text }));
        if (conv.screen) {
          // TODO: multiple links in response
          // const responses = [ new LinkOutSuggestionFull( { type: 0, name: i18next.t('OPEN_SEARCH') }, query ), new LinkOutSuggestionFull( { type: 1, name: i18next.t('OPEN_PLAY_MUSIC') }, query ), new LinkOutSuggestionFull( { type: 2, name: i18next.t('OPEN_YOUTUBE') }, query ), ];
          conv.ask(
            new LinkOutSuggestionFull(
              { type: 1, name: i18next.t('OPEN_PLAY_MUSIC') },
              query
            )
          );
        }
        conv.close();
      } else {
        conv.close(message);
      }
      break;
    }
    case INTENT.STATION_INTENT: {
      ssml = `<speak>${i18next.t('STATION')}</speak>`;
      conv.ask(ssml);
      conv.ask(new Suggestions(['Aristocrats', 'SkyRadio']));
      break;
    }
    default: {
      const { message } = await handler();
      conv.close(message);
    }
  }
});

async function handler(stationName: RadioStationName = 'aristocrats') {
  if (!stationInstance) {
    stationInstance = StationFactory.createStation(RadioStation[stationName]);
  }
  const info: NowPlayingInfo = await stationInstance.getNowplayingInfo();
  const message = stationInstance.getMessage();
  const query = stationInstance.getSearchString();
  // console.log('DEBUG: handler -> message', { message });
  return { message, query, info };
}

// The entry point to handle a http request
export const nowplaying = functions.region('europe-west2').https.onRequest(app);
// For testing purposes
export const testApp = app;
