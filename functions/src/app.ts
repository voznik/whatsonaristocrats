/* eslint-disable @typescript-eslint/no-floating-promises */
import { dialogflow, Suggestions, SimpleResponse } from 'actions-on-google';
import i18next from 'i18next';

import * as INTENT from './constants/intent';
import { RESOURCES } from './constants/resources';
import {
  NowPlayingInfo,
  RadioStation,
  RadioStationName,
  Station,
  getBrowseItemsResponse,
} from './models';
import { StationFactory } from './services';

i18next.init({
  fallbackLng: 'en-US',
  debug: true,
  resources: RESOURCES,
});

let stationInstance: Station;
const STATIONS = ['Aristocrats', 'SkyRadio'];

async function handler(stationName: RadioStationName = 'aristocrats') {
  if (!stationInstance) {
    stationInstance = StationFactory.createStation(RadioStation[stationName]);
  }
  const info: NowPlayingInfo = await stationInstance.getNowplayingInfo();
  const message = stationInstance.getMessage();
  const query = stationInstance.getSearchString();
  console.log('DEBUG: handler -> message', { message });
  return { message, query, info };
}

export const app = dialogflow({ debug: true });

app.middleware((conv) => {
  // conv.localize = () => {
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
  console.log('DEBUG: error:', { error });
  conv.ask(i18next.t('ERROR'));
});
// you can add a fallback function instead of a function for individual intents
app.fallback(async (conv) => {
  // intent contains the name of the intent
  // you defined in the Intents area of Dialogflow
  console.log('DEBUG: STATION_CHOOSE -> conv', conv);
  const { intent, parameters, input } = conv;
  const station = parameters?.station || input;
  switch (intent) {
    case INTENT.STATION_CHOOSE: {
      console.log('DEBUG: STATION_CHOOSE -> message', {
        intent,
        parameters,
        input,
      });
      const { message, query } = await handler(station as RadioStationName);
      if (query) {
        const speech = `<speak><p><s>${i18next.t('FOUND_TITLE', {
          station,
        })}</s><break time="1"/><s>${message}</s></p></speak>`;
        const text = `${i18next.t('FOUND_TITLE', { station })}${message}`;
        conv.ask(new SimpleResponse({ speech, text }));
        if (
          conv.screen &&
          conv.surface.capabilities.has('actions.capability.WEB_BROWSER')
        ) {
          conv.ask(getBrowseItemsResponse(query));
        }
        // conv.close();
      } else {
        conv.close(message);
      }
      break;
    }
    case INTENT.WELCOME: {
      /* const savedStation = (conv.user as any).storage.favoriteStation;
      if (savedStation || station) {
        conv.ask(
          `Hey there! I remember your favorite station is ${savedStation ||
            station}`
        );
      } else {
      } */
      conv.ask(i18next.t('STATION'));
      conv.ask(new Suggestions(STATIONS));
      break;
    }
    case INTENT.STATION_SAVE:
      {
        if (conv.user.verification === 'VERIFIED') {
          (conv.user as any).storage.favoriteStation = station;
          conv.ask(`Alright, I'll remember that you like ${station}. See you!`);
        } else {
          conv.ask(
            `${station} is my favorite too! I can't save that right now ` +
              `but you can tell me again next time!`
          );
        }
      }
      break;
    default: {
      const { message } = await handler();
      conv.close(message);
    }
  }
});
