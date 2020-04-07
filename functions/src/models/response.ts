import {
  BasicCard,
  LinkOutSuggestion,
  GoogleActionsV2UiElementsLinkOutSuggestion,
} from 'actions-on-google';
import { NowPlayingInfo } from './nowplaying';

// Spotify - intent://#Intent;launchFlags=0x10000000;component=com.spotify.music/.MainActivity;end
// Google-YouTube - intent://#Intent;launchFlags=0x10000000;component=com.google.android.youtube;action=android.intent.action.ACTION_WEB_SEARCH;S.query=x;end
// Google-Play-Music -  intent://#Intent;launchFlags=0x10000000;component=com.google.android.music;android.intent.action.ACTION_WEB_SEARCH;S.query=x;end

enum LinkType {
  Search,
  Playmusic,
  Youtube,
  // Spotify,
}

const LinkConfig = {
  0: {
    packageName: 'com.google.android.googlequicksearchbox',
    url: `intent://#Intent;launchFlags=0x10000000;package=com.google.android.googlequicksearchbox;action=android.intent.action.ACTION_WEB_SEARCH;S.query=;end`,
  },
  1: {
    packageName: 'com.google.android.music',
    // url: `intent://search/#Intent;package=com.google.android.music;S.query=;end`,
    url: `https://play.google.com/music/listen#/sr/S.query=;`,
  },
  2: {
    packageName: 'com.google.android.youtube',
    url: `intent://search/#Intent;scheme:https;package=com.google.android.youtube;S.query=;end`,
  },
};

export class LinkOutSuggestionFull extends LinkOutSuggestion
  implements GoogleActionsV2UiElementsLinkOutSuggestion {
  // destinationName: string;
  // openUrlAction: GoogleActionsV2UiElementsOpenUrlAction;

  constructor(
    options: { type: LinkType; name: string; info?: NowPlayingInfo },
    query: string
  ) {
    super({ name: options.name, url: '' });
    delete this.url;
    this.destinationName = options.name;
    this.openUrlAction = {
      androidApp: {
        packageName: LinkConfig[options.type].packageName,
      },
      url: LinkConfig[options.type].url.replace(
        'S.query=;',
        // `S.query=${query};`
        query
      ),
    };
  }
}

export class NowplayingCard extends BasicCard {
  constructor(title: string, message: string, query: string) {
    super({
      title,
      buttons: [
        new LinkOutSuggestionFull({ type: LinkType.Search, name: '' }, query),
      ],
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
