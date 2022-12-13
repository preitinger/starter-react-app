import Timer from './Timer.tsx'
// import

class myPromise extends Promise {
  constructor(f) {
    super(f);
  }
}

describe('Timer', () => {
  it('should provide a method singleShot that returns a Promise fulfilled ' +
    'after some milliseconds.', async () => {
      // TODO begin remove me
      let d = new myPromise((onSucc, onFail) => {

      });
      d.then(() => { console.log('d.then'); });
      // TODO end remove me


      let state = 0;
      setTimeout(() => { console.log('9'); state = 1; }, 5);
      setTimeout(() => { console.log('11'); state = 2; }, 15);

      // let thatOns;
      //
      //
      // const p = new Promise((ons, onf) => {
      //   thatOns = ons;
      //   // setTimeout(() => {
      //   //   ons();
      //   // }, 10);
      // });
      // p.then(() => {
      //   console.log('in then');
      // })

      const t = Timer.singleShot(10);
      // const t = new Promise((onSucc, onFail) => {
      //   setTimeout(() => {
      //     console.log('before onSucc()');
      //     onSucc();
      //   }, 10)
      // });
      console.log('t', t);
      t.then(() => {
        console.log('now then');
          expect(state).toBe(1);
      });
      await t;
    });
    it(
      'should provide a method repeating(func, milliseconds, times) that ' +
      'calls func <times> times every <milliseconds> ms',
      async () => {
        let sum = 0;
        const t = Timer.repeating(() => { ++sum; }, 10, 3);
        await t;
        expect(sum).toBe(3);
      }
    );

});

// test('Timer singleshot', async () => {
//   throw new Error('nyi');
// });
