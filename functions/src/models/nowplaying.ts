import { parseTitleBy } from '../helpers';

export class NowPlayingInfo {
  artist = 'undefined artist';
  song = 'undefined song';

  constructor(xmlData?: any) {
    if (xmlData) {
      this.artist = parseTitleBy(xmlData, 'artist');
      this.song = parseTitleBy(xmlData, 'song');
    }
  }
}
