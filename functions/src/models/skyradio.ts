import { Station } from './station';
import { NowPlayingInfo } from './nowplaying';

const SKYRADIO_CHANNELS = {
  sky: 'http://dad.akaver.com/api/songtitles/SKY',
  dance: 'http://dad.akaver.com/api/songtitles/SKYDANCE',
  gold: 'http://dad.akaver.com/api/songtitles/SKYGOLD',
};

export class SkyradioStation extends Station {
  constructor(channels = SKYRADIO_CHANNELS) {
    super(channels);
  }

  async parseData(data: SkyradioResponse) {
    const info = {} as NowPlayingInfo;
    if (data) {
      info.artist = data.SongHistoryList[0].Artist;
      info.song = data.SongHistoryList[0].Title;
    }
    return Promise.resolve(info);
  }
}

interface SkyradioResponse {
  SongHistoryList: SongHistoryList[];
}

interface SongHistoryList {
  Artist: string;
  Title: string;
  Album?: string;
  Count?: number;
  IsSkippable?: boolean;
  SqlTimeStamp?: string;
  TimeStamp?: number;
}
