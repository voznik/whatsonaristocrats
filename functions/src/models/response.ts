import {
  BasicCard,
  LinkOutSuggestion,
  GoogleActionsV2UiElementsLinkOutSuggestion,
  BrowseCarousel,
  BrowseCarouselItem,
  Image,
} from 'actions-on-google';
import { NowPlayingInfo } from './nowplaying';

// Spotify - intent://#Intent;launchFlags=0x10000000;component=com.spotify.music/.MainActivity;end
// Google-YouTube - intent://#Intent;launchFlags=0x10000000;component=com.google.android.youtube;action=android.intent.action.ACTION_WEB_SEARCH;S.query=x;end
// Google-Play-Music -  intent://#Intent;launchFlags=0x10000000;component=com.google.android.music;android.intent.action.ACTION_WEB_SEARCH;S.query=x;end

enum LinkType {
  Search,
  Playmusic,
  Youtube,
  Deezer,
  Spotify,
}

const LinkConfig = {
  [LinkType.Search]: {
    title: 'Google',
    logo:
      'https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png',
    packageName: 'com.google.android.googlequicksearchbox',
    // url: `intent://#Intent;launchFlags=0x10000000;package=com.google.android.googlequicksearchbox;action=android.intent.action.ACTION_WEB_SEARCH;S.query=;end`,
    url: `https://google.com/search?q=`,
  },
  [LinkType.Playmusic]: {
    title: 'Play Music',
    logo:
      'https://images.shazam.com/static/icons/feed/android/v4/listen_googleplaymusic.png',
    packageName: 'com.google.android.music',
    // url: `intent://search/#Intent;package=com.google.android.music;S.query=;end`,
    // url: `http://intent//play.google.com/music/m/T7aif5jqjiz6ivlh26frrmbukt4?signup_if_needed=1&play=1#Intent;scheme=http;package=com.google.android.music;S.android.intent.extra.REFERRER_NAME=https%3A%2F%2Fwww.google.com;end`, // INFO: from search on android
    url: `https://play.google.com/music/listen#/sr/`,
  },
  [LinkType.Youtube]: {
    title: 'Youtube',
    logo:
      'https://images.shazam.com/static/icons/feed/android/v4/listen_deezer.png',
    packageName: 'com.google.android.youtube',
    // url: `intent://search/#Intent;scheme:https;package=com.google.android.youtube;S.query=;end`,
    url: `https://music.youtube.com/search?q=`,
  },
  [LinkType.Deezer]: {
    title: 'Deezer',
    logo:
      'https://images.shazam.com/static/icons/feed/android/v4/listen_deezer.png',
    packageName: 'com.google.android.deezer',
    url: `https://deezer.com/search?q=`,
  },
  [LinkType.Spotify]: {
    title: 'Spotify',
    logo:
      'https://images.shazam.com/static/icons/feed/android/v4/listen_spotify.png',
    packageName: 'com.google.android.youtube',
    url: `https://open.spotify.com/search/`,
  },
};

interface LinkOutSuggestionFullOptions {
  type: LinkType;
  title?: string;
  info?: NowPlayingInfo;
  query?: string;
}

export class LinkOutSuggestionFull extends LinkOutSuggestion
  implements GoogleActionsV2UiElementsLinkOutSuggestion {
  constructor(options: LinkOutSuggestionFullOptions = { type: 0, query: '' }) {
    super({
      name: options.title || LinkConfig[options.type].title,
      url: LinkConfig[options.type].url.concat(options.query || ''),
    });
    this.destinationName = options.title;
    this.openUrlAction = {
      androidApp: {
        packageName: LinkConfig[options.type].packageName,
      },
      url: LinkConfig[options.type].url.replace(
        'S.query=',
        // `S.query=${query}`
        options.query || ''
      ),
    };
  }
}

// tslint:disable: prefer-const triple-equals
/**
 * @tutorial https://developers.google.com/assistant/conversational/rich-responses#asdk-node-browse-carousel
 * @param query string
 */
export function getBrowseItemsResponse(query: string) {
  const items = [];
  for (const key in LinkConfig) {
    // eslint-disable-next-line
    let { title, url, logo } = LinkConfig[(key as unknown) as LinkType];
    url = url.concat(query);
    const image = new Image({
      url: logo,
      alt: title,
    });
    items.push(new BrowseCarouselItem({ title, url, image }));
  }
  return new BrowseCarousel({ items });
}

export class NowplayingCard extends BasicCard {
  constructor(title: string, message: string, query: string) {
    super({
      title,
      buttons: [new LinkOutSuggestionFull({ type: LinkType.Search, query })],
    });
    this.formattedText = message;
  }
}

/**
 * https://developer.android.com/guide/components/intents-common#PlaySearch
 *
public void playSearchArtist(String artist) {
    Intent intent = new Intent(MediaStore.INTENT_ACTION_MEDIA_PLAY_FROM_SEARCH);
    intent.putExtra(MediaStore.EXTRA_MEDIA_FOCUS,
                    MediaStore.Audio.Artists.ENTRY_CONTENT_TYPE);
    intent.putExtra(MediaStore.EXTRA_MEDIA_ARTIST, artist);
    intent.putExtra(SearchManager.QUERY, artist);
    if (intent.resolveActivity(getPackageManager()) != null) {
        startActivity(intent);
    }
}
 */
