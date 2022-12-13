import {mkMove, doMove} from './Move'
import {min, max} from './utils/Util'
import {mkBoard} from './Board'

// Fake timers using Jest
beforeEach(() => {
  jest.useFakeTimers()
})

// Running all pending timers and switching to real timers using Jest
afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

describe('mkMove works when', () => {
  it('can swap using tuples', () => {
    let a = 1, b = 2;
    [a, b] = [b, a];
    expect(a).toBe(2);
    expect(b).toBe(1);
  }),
  it('returns object with values from its arguments', () => {
    let rowIdx = 0, segIdx = 1, first = 2, last = 3;
    const m = (((mkMove(rowIdx))(segIdx))(first))(last)
    expect(m).toEqual({
      rowIdx: rowIdx,
      segIdx: segIdx,
      first: first,
      last: last
    })
  }),
  it('returns object with all props -1 if any argument is undefined', () => {
    const vals = [undefined, 0, 1, 2];
    vals.forEach((rowIdx) => {
      vals.forEach((segIdx) => {
        vals.forEach((first) => {
          vals.forEach((last) => {
            const m = (((mkMove(rowIdx))(segIdx))(first))(last);
            const anyUndefined = (
              rowIdx === undefined ||
              segIdx === undefined ||
              first === undefined ||
              last === undefined
            )

            if (anyUndefined) {
              expect(m).toEqual({
                rowIdx: -1,
                segIdx: -1,
                first: -1,
                last: -1
              })
            } else {
              expect(m).toEqual({
                rowIdx: rowIdx,
                segIdx: segIdx,
                first: min(first, last),
                last: max(first, last)
              })
            }
          })
        })
      })
    });
  })
})

describe('doMove works when', () => {
  it('removes segment completely', () => {
    let board = mkBoard(5);
    expect(board).toMatchObject({
      rows: [
        {
          segments: [
            {
              size: 1,
              checked: false,
            }
          ]
        },
        {
          segments: [
            {
              size: 2,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 3,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 4,
              checked: false

            }
          ]
        },
        {
          segments: [
            {
              size: 5,
              checked: false
            }
          ]
        }
      ]

    })
    doMove(board, {
      rowIdx: 0,
      segIdx: 0,
      first: 0,
      last: 0
    })
    expect(board).toMatchObject({
      rows: [
        {
          segments: [
            {
              size: 1,
              checked: true,
            }
          ]
        },
        {
          segments: [
            {
              size: 2,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 3,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 4,
              checked: false

            }
          ]
        },
        {
          segments: [
            {
              size: 5,
              checked: false
            }
          ]
        }
      ]
    })
  }),
  it('leaves new left segment', () => {
    let board = mkBoard(5);
    console.log('board', board, board.rows[0].segments);
    expect(board).toMatchObject({
      rows: [
        {
          segments: [
            {
              size: 1,
              checked: false,
            }
          ]
        },
        {
          segments: [
            {
              size: 2,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 3,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 4,
              checked: false

            }
          ]
        },
        {
          segments: [
            {
              size: 5,
              checked: false
            }
          ]
        }
      ]
    })
    doMove(board, mkMove(1)(0)(1)(1));
    expect(board).toMatchObject({
      rows: [
        {
          segments: [
            {
              size: 1,
              checked: false,
            }
          ]
        },
        {
          segments: [
            {
              size: 1,
              checked: false
            },
            {
              size: 1,
              checked: true
            }
          ]
        },
        {
          segments: [
            {
              size: 3,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 4,
              checked: false

            }
          ]
        },
        {
          segments: [
            {
              size: 5,
              checked: false
            }
          ]
        }
      ]

    })
  }),
  it('leaves new right segment', () => {
    let board = mkBoard(5);
    console.log('board', board, board.rows[0].segments);
    expect(board).toMatchObject({
      rows: [
        {
          segments: [
            {
              size: 1,
              checked: false,
            }
          ]
        },
        {
          segments: [
            {
              size: 2,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 3,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 4,
              checked: false

            }
          ]
        },
        {
          segments: [
            {
              size: 5,
              checked: false
            }
          ]
        }
      ]
    })
    doMove(board, mkMove(1)(0)(0)(0));
    expect(board).toMatchObject({
      rows: [
        {
          segments: [
            {
              size: 1,
              checked: false,
            }
          ]
        },
        {
          segments: [
            {
              size: 1,
              checked: true
            },
            {
              size: 1,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 3,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 4,
              checked: false

            }
          ]
        },
        {
          segments: [
            {
              size: 5,
              checked: false
            }
          ]
        }
      ]

    })
  }),

  it('leaves new left and right segment', () => {
    let board = mkBoard(5);
    console.log('board', board, board.rows[0].segments);
    expect(board).toMatchObject({
      rows: [
        {
          segments: [
            {
              size: 1,
              checked: false,
            }
          ]
        },
        {
          segments: [
            {
              size: 2,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 3,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 4,
              checked: false

            }
          ]
        },
        {
          segments: [
            {
              size: 5,
              checked: false
            }
          ]
        }
      ]
    })
    // use function currying:
    doMove(board, mkMove (2) (0) (1) (1));
    expect(board).toMatchObject({
      rows: [
        {
          segments: [
            {
              size: 1,
              checked: false,
            }
          ]
        },
        {
          segments: [
            {
              size: 2,
              checked: false
            }
          ]
        },
        {
          segments: [
            {
              size: 1,
              checked: false
            },
            {
              size: 1,
              checked: true
            },
            {
              size: 1,
              checked: false
            },
          ]
        },
        {
          segments: [
            {
              size: 4,
              checked: false

            }
          ]
        },
        {
          segments: [
            {
              size: 5,
              checked: false
            }
          ]
        }
      ]
    })
  })


})
