import fetch from 'node-fetch';
import { Parser } from 'xml2js';
import { Station, NowPlayingInfo } from '../models';
import { parseTitleBy } from '../helpers';

const parser = new Parser();

export async function fetchAristocratsApi(
  station: Station = Station.Aristocrats
): Promise<NowPlayingInfo> {
  const data: NowPlayingInfo = {
    artist: 'undefined song',
    song: 'undefined artist',
  };
  const nowplayingUrl = `https://aristocrats.fm/service/nowplaying-${station}8.xml`;
  const response = await fetch(nowplayingUrl).catch(() => {
    console.log('Error in fetching NowPlaying');
  });
  if (response) {
    const xmlData = await response.text();
    const rawData = await parser.parseStringPromise(xmlData);
    // console.log({ rawData });
    data.artist = parseTitleBy(rawData, 'artist');
    data.song = parseTitleBy(rawData, 'song');
  }
  return data;
}
