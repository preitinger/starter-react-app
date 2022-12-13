console.log('CountDown.tsx');

class Timer {

  // returns a Promise that fulfills after ms milliseconds.
  static singleShot(ms: number): Promise {
    return new Promise((onSucc, onFail) => {
      setTimeout(() => {
        onSucc();
      }, ms);
    })
  }

  // returns a Promise that fulfills after having called f <count> timers
  // every <ms> milliseconds.
  static repeating(f: () => any, ms: number, count: number) {
    if (count <= 0) return Promise.resolve();
    console.log('repeating gonna return regular promise.');
    return new Promise((onSucc) => {
      let remaining = count;
      const timerId = setInterval(
        () => {
          f();
          if (--remaining <= 0) {
            clearInterval(timerId);
            onSucc();
          }
        },
        ms
      );
    });
  }
}

export default Timer;
