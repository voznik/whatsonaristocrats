import i18n from 'i18n';
import { parseTitleBy, isEmptyString } from '../helpers';

export class NowPlayingInfo {
  artist = '';
  song = '';

  constructor(xmlData?: any) {
    if (xmlData) {
      this.artist = parseTitleBy(xmlData, 'artist');
      this.song = parseTitleBy(xmlData, 'song');
    }
  }

  getSearchString() {
    return `${this.song}+${this.artist}`;
  }

  getMessage() {
    // var example = i18n.__('%2$d then %1$s then %3$.2f', 'First', 2, 333.333);
    const message =
      isEmptyString(this.artist) || isEmptyString(this.song)
        ? i18n.__('MESSAGE_EMPTY')
        : i18n.__('MESSAGE', { song: this.song, artist: this.artist });
    return message;
  }
}
