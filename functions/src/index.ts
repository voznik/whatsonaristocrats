import * as functions from 'firebase-functions';
import { app } from './app';

// The entry point to handle a http request
export const nowplaying = functions.region('europe-west2').https.onRequest(app);
// For testing purposes
export const testApp = app;
