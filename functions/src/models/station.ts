/* eslint-disable @typescript-eslint/no-explicit-any */
import i18next from 'i18next';
import fetch from 'node-fetch';
import { isEmptyString } from '../helpers';
import { NowPlayingInfo } from './nowplaying';

export abstract class Station {
  currentChannel: string;
  info: NowPlayingInfo = {} as NowPlayingInfo;

  constructor(public channels: Channels, currentChannel?: string) {
    this.currentChannel = currentChannel || Object.keys(channels)[0];
  }

  siwtchChannel(channel: string) {
    if (Object.keys(this.channels).includes(channel)) {
      this.currentChannel = channel;
    }
  }

  async getNowplayingInfo(): Promise<NowPlayingInfo> {
    const response = await this.request();
    this.info = await this.parseData(response);
    return this.info;
  }

  getSearchString() {
    return encodeURI(`${this.info.song}+${this.info.artist}`);
  }

  getMessage() {
    // var example = i18next.t('%2$d then %1$s then %3$.2f', 'First', 2, 333.333);
    const { artist, song } = this.info;
    const message =
      isEmptyString(artist) || isEmptyString(song)
        ? i18next.t('MESSAGE_EMPTY')
        : i18next.t('MESSAGE', { song, artist });
    return message;
  }

  async request(channel?: string): Promise<any> {
    const nowplayingUrl = this.channels[channel || this.currentChannel];
    return await fetch(nowplayingUrl).catch((err) => {
      console.error('DEBUG: Error in fetching NowPlaying', err);
    });
  }

  abstract parseData(...args: any[]): Promise<NowPlayingInfo>;
}

export type Channels = { [key: string]: string };
export enum RadioStation {
  aristocrats,
  skyradio,
}
export type RadioStationName = keyof typeof RadioStation;
