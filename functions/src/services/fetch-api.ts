import fetch from 'node-fetch';
import { Parser } from 'xml2js';
import { Station, NowPlayingInfo } from '../models';

const parser = new Parser();

export async function fetchAristocratsApi(
  station: Station = Station.Aristocrats
): Promise<NowPlayingInfo> {
  let info = new NowPlayingInfo();
  const nowplayingUrl = `https://aristocrats.fm/service/nowplaying-${station}8.xml`;
  const response = await fetch(nowplayingUrl).catch(() => {
    console.log('Error in fetching NowPlaying');
  });
  if (response) {
    const parsedData = await parser.parseStringPromise(await response.text());
    info = new NowPlayingInfo(parsedData);
  }
  return info;
}
