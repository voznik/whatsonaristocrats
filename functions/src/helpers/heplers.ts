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

/**
 * @description get nested property
 * @param p
 * @param o
 * @tutorial https://glebbahmutov.com/blog/call-me-maybe/
 */
export function get(keys: string | string[], o: any) {
  // tslint:disable-next-line: no-parameter-reassignment
  keys = isArray(keys) ? keys : keys.split('.');
  return keys.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o);
}

/**
 * @tutorial https://stackoverflow.com/a/25835337/4115894
 * @param o Object
 * @param fields []
 */
export function pick(o: any, ...fields: string[]) {
  return fields.reduce((a, x) => {
    if (o.hasOwnProperty(x)) {
      a[x] = o[x];
    }
    return a;
  }, {} as any);
}

export function parseTitleBy(rawData: any, key: 'artist' | 'song') {
  return get(['Playlist', key, '0', '$', 'title'], rawData);
}

export function getMessage(data: NowPlayingInfo) {
  return isEmptyString(data.artist) || isEmptyString(data.song)
    ? `There is nothing playing at the moment. You can check again later. Thank you!`
    : `It's "${data.song}" by ${data.artist}`;
}
