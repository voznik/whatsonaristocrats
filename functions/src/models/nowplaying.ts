import { parseTitleBy, isEmptyString } from '../helpers';

export class NowPlayingInfo {
  artist = undefined;
  song = undefined;

  constructor(xmlData?: any) {
    if (xmlData) {
      this.artist = parseTitleBy(xmlData, 'artist');
      this.song = parseTitleBy(xmlData, 'song');
    }
  }

  getMessage() {
    return isEmptyString(this.artist) || isEmptyString(this.song)
      ? `There is nothing playing at the moment. You can check again later. Thank you!`
      : `It's "${this.song}" by ${this.artist}`;
  }
}
