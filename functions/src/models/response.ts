import { Button, LinkOutSuggestion, BasicCard } from 'actions-on-google';

export class SearchButton extends Button {
  constructor(query: string) {
    const url = `https://google.com/search?q=${query}`;
    super({
      title: 'Search this Song',
      url,
      // TODO:
      /* action: {
        androidApp: {
          packageName: 'com.google.android.googlequicksearchbox',
        },
        url: `intent://google.com/search?q=${query}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.WEB_SEARCH;end;`,
      }, */
    });
  }
}

export class LinkOpenMusic extends LinkOutSuggestion {
  constructor(name: string, query: string) {
    const url = `https://play.google.com/music/listen#/sr/${query}`;
    super({ name, url });
    this.openUrlAction = {
      androidApp: {
        packageName: 'com.google.android.music',
      },
      url,
    };
  }
}

export class NowplayingCard extends BasicCard {
  constructor(title: string, message: string, query: string) {
    super({
      title,
      buttons: [new SearchButton(query)],
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
