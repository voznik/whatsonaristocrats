// "test": "TS_NODE_PROJECT='./tsconfig.spec.json' mocha -r ts-node/register --reporter spec test/**/*spec.ts"
import 'jest';
import * as admin from 'firebase-admin';
import functionsTest from 'firebase-functions-test';
import { FeaturesList } from 'firebase-functions-test/lib/features';
import { nowplaying } from '../src';

describe('test nowplaying api', () => {
  let features: FeaturesList;
  let appSpy: jest.SpyInstance;
  // Require and initialize firebase-functions-test. Since we are not passing in any parameters, it will
  // be initialized in an "offline mode", which means we have to stub out all the methods that interact
  // with Firebase services.
  features = functionsTest();

  beforeAll(async () => {
    // [START stubAdminInit]
    // If index.js calls admin.initializeApp at the top of the file,
    // we need to stub it out before requiring index.js. This is because the
    // functions will be executed as a part of the require process.
    // Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
    appSpy = jest.spyOn(admin, 'initializeApp');
    // [END stubAdminInit]
  });

  afterAll(() => {
    // Restore admin.initializeApp() to its original method.
    appSpy.mockRestore();
    // Do other cleanup tasks.
    features.cleanup();
  });

  it('should return undefined titles', async () => {
    // const wrapped = features.wrap(nowplaying);
    // const result = await wrapped({});
    // expect(result.message).toEqual(`It's "" by `);
  });
});
