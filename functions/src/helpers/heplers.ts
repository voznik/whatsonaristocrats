import { NowPlayingInfo } from '../models';

export function isUndefined(value: any) {
  return typeof value === 'undefined';
}

export function isNullOrUndefined(value: any) {
  return value === null || isUndefined(value);
}

export function isFunction(value: any) {
  return typeof value === 'function';
}

export function isNumber(value: any) {
  return typeof value === 'number';
}

export function isString(value: any) {
  return typeof value === 'string';
}

export function isBoolean(value: any) {
  return typeof value === 'boolean';
}

export function isObject(value: any) {
  return value !== null && typeof value === 'object';
}

export function isArray<T>(item: T[] | any): item is Array<T> {
  return !!(item && item.constructor === Array);
}

export function isNumberFinite(value: any) {
  return isNumber(value) && isFinite(value);
}

export function isEmptyString(value: any) {
  return isUndefined(value) || (isString(value) && !value.length);
}

export function isEmptyObject(obj: any, deep = false) {
  if (!isObject(obj)) {
    return true;
  } else {
    if (Object.keys(obj).length) {
      return deep
        ? Object.values(obj).every(val => isUndefined(val) || val === null)
        : false;
    }
    return true;
  }
}

export function parseTitleBy(rawData: any, key: 'artist' | 'song') {
  // return get(['Playlist', key, '0', '$', 'title'], rawData);
  return rawData.Playlist[key][0]['$']['title'];
}

export function getMessage(data: NowPlayingInfo) {
  return isEmptyString(data.artist) || isEmptyString(data.song)
    ? `There is nothing playing at the moment. You can check again later. Thank you!`
    : `It's "${data.song}" by ${data.artist}`;
}
