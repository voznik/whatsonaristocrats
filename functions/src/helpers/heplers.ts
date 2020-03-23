import { NowPlayingInfo } from '../models';

export function parseTitleBy(rawData: any, key: 'artist' | 'song') {
  return rawData.Playlist[key][0]['$']['title'];
}

export function getMessage(data: NowPlayingInfo) {
  return `It's "${data.song}" by ${data.artist}`;
}
