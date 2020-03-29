// tslint: disable: no-unused;
// tslint:disable-next-line: no-import-side-effect
// import '@types/jest';
import * as admin from 'firebase-admin';
import functionsTest from 'firebase-functions-test';
import { FeaturesList } from 'firebase-functions-test/lib/features';
import { nowplaying, testApp } from '../src';
import { NowPlayingInfo } from '../src/models';

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

  it('Default Welcome Intent', async () => {
    const { body } = await testApp(
      {
        inputs: [
          {
            intent: 'actions.intent.MAIN',
          },
        ],
      },
      {}
    );
    expect(body.payload.google.richResponse.items.length).toBeGreaterThan(0);
    expect(
      body.payload.google.richResponse.items[0].simpleResponse.textToSpeech
    ).toMatch("It's");
  });

  /* it('should return undefined titles', async done => {
    // [START assertHTTP]
    // A fake request object, with req.query.text set to 'input'
    const req = {};
    // A fake response object, with a stubbed redirect function which asserts that it is called
    // with parameters 303, 'new_ref'.
    const res = {
      send: jest.fn(() => {
        const data = new NowPlayingInfo();
        // expect(res.send).toHaveBeenCalled();
        done();
      }),
    };

    // Invoke addMessage with our fake request and response objects. This will cause the
    // assertions in the response object to be evaluated.
    const info = await nowplaying({} as any, {} as any);
    expect(res.send).toHaveBeenCalled();
    // done();
    // [END assertHTTP]
  }); */
});
