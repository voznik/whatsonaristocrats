import { Parser } from 'xml2js';
import { Station } from './station';
import { NowPlayingInfo } from './nowplaying';

const parser = new Parser();

const ARISTOCRATS_CHANNELS = {
  aristocrats: 'https://aristocrats.fm/service/nowplaying-aristocrats8.xml',
  jazz: 'https://aristocrats.fm/service/nowplaying-ajazz8.xml',
  music: 'https://aristocrats.fm/service/nowplaying-amusic8.xml',
};

export class AristoctratsStation extends Station {
  constructor(channels = ARISTOCRATS_CHANNELS) {
    super(channels);
  }

  async parseData(data: any) {
    const info = {} as NowPlayingInfo;
    if (data) {
      const parsedData: AristoctratsResponse = await parser.parseStringPromise(
        await data.text()
      );
      info.artist = this.parseTitleBy(parsedData, 'artist');
      info.song = this.parseTitleBy(parsedData, 'song');
    }
    return info;
  }

  private parseTitleBy(xmlData: AristoctratsResponse, key: 'artist' | 'song') {
    return xmlData.Playlist[key][0]['$']['title'];
  }
}

interface AristoctratsResponse {
  Playlist: {
    [key: string]: [
      {
        $: {
          title: string;
        };
      }
    ];
  };
}
