import {
  RadioStation,
  Station,
  AristoctratsStation,
  SkyradioStation,
} from '../models';

export class StationFactory {
  // id: RadioStation;
  static createStation(id: RadioStation): Station {
    if (id === RadioStation.aristocrats) {
      return new AristoctratsStation();
    } else {
      return new SkyradioStation();
    }
  }
}
