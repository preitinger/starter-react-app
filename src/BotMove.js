import {xorSum} from './Board'
import {mkMove2} from './Move'

function scanBoard(board) {
  let xorSum = 0;
  let segs1 = [];
  let segsNot1 = [];

  for (let i = 0; i < board.rows.length; ++i) {
    for (let j = 0; j < board.rows[i].segments.length; ++j) {
      const seg = board.rows[i].segments[j];
      if (!seg.checked) {
        xorSum ^= seg.size;
        const move = mkMove2(i, j, 0, seg.size - 1);
        if (seg.size === 1) {
          segs1.push(move);
        } else {
          segsNot1.push(move);
        }
      }
    }
  }

  return {
    xorSum: xorSum,
    segs1: segs1,
    segsNot1: segsNot1
  }
}

const findWinningMoves = (board, lastWins) => {
  const {xorSum, segs1, segsNot1} = scanBoard(board);

  if (segsNot1.length === 0) {
    return ((xorSum === 0) === lastWins ? [] : segs1);
  } else if (segsNot1.length === 1) {
    const size = segsNot1[0].last - segsNot1[0].first + 1;
    if (((xorSum ^ size) === 0) === lastWins) {
      // segsNot1[0] komplett checken
      return segsNot1;
    } else {
      // 1 ganz links oder rechts in segsNot1[0] uebrig lassen
      return [
        mkMove2(segsNot1[0].rowIdx, segsNot1[0].segIdx, 1, segsNot1[0].last),
        mkMove2(segsNot1[0].rowIdx, segsNot1[0].segIdx, segsNot1[0].first, segsNot1[0].last - 1)
      ]
    }
  } else { // segsNot1.length > 1
    if (xorSum === 0) return [];
    const l = [];
    const allMoves = segsNot1.concat(segs1);
    for (let i = 0; i < allMoves.length; ++i) {
      const size = allMoves[i].last - allMoves[i].first + 1;
      for (let left = 0; left < size; ++left) {
        for (let right = 0; right < size - left; ++right) {
          if ((xorSum ^ size ^ left ^ right) === 0) {
            l.push(mkMove2(allMoves[i].rowIdx, allMoves[i].segIdx, left, size - 1 - right));
          }
        }
      }
    }

    return l;
  }
}

const findAllMoves = (board) => {
  const l = [];
  for (let i = 0; i < board.rows.length; ++i) {
    for (let j = 0; j < board.rows[i].segments.length; ++j) {
      const seg = board.rows[i].segments[j];
      if (!seg.checked) {
        for (let first = 0; first < seg.size; ++first) {
          for (let last = first; last < seg.size; ++last) {
            l.push(mkMove2(i, j, first, last));
          }
        }
      }
    }
  }
  return l;
}

const selectRnd = (l) => {
  if (l.length === 0) return null;
  const r = Math.random();
  console.log("r=", r);
  console.log("l.length=", l.length);
  const res = l[Math.floor(Math.random() * l.length)];
  console.log("selectRnd returns ", res);
  return res;
}

const selectShort = (l) => {
  if (l.length === 0) return null;
  let shortest = [];
  let shortestDist = 1000000;

  for (const m of l) {
    if (m.last < m.first) console.error("m", m);
    const dist = m.last - m.first;
    if (dist < shortestDist) {
      shortestDist = dist;
      shortest = [m];
    } else if (dist === shortestDist) {
      shortest.push(m);
    }
  }

  return selectRnd(shortest);
}

const selectLong = (l) => {
  if (l.length === 0) return null;
  let longest = [];
  let longestDist = -1;

  for (const m of l) {
    if (m.last < m.first) console.error("m", m);
    const dist = m.last - m.first;
    if (dist > longestDist) {
      longestDist = dist;
      longest = [m];
    } else if (dist === longestDist) {
      longest.push(m);
    }
  }

  return selectRnd(longest);
}

const selectors = {
  random: selectRnd,
  short: selectShort,
  long: selectLong
}

const BotMove = {
  query: (board, lastWins, priority) => {
    const winningMoves = findWinningMoves(board, lastWins);
    console.log("winningMoves=", winningMoves);

    if (winningMoves.length > 0) {
      return {
        move: selectors[priority](winningMoves),
        willWin: true
      };
    }

    return {
      move: selectors[priority](findAllMoves(board)),
      willWin: false
    };
  }
}

export default BotMove;
