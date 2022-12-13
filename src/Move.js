import {min, max} from './utils/Util'
import {mkSeg} from './Board'

function doMove(board, move) {
  // console.log("doMove: board=", board, ", move=", move);
  const first = min(move.first, move.last)
  const last = max(move.first, move.last)
  const segs = board.rows[move.rowIdx].segments
  const seg = segs[move.segIdx]
  const right = seg.size - last - 1
  const left = first;
  const mid = seg.size - right - left;

  if (right > 0) {
    segs.splice(move.segIdx + 1, 0, mkSeg(right));
  }

  seg.size = mid;
  seg.checked = true;

  if (left > 0) {
    segs.splice(move.segIdx, 0, mkSeg(left));
  }
}

const mkMove = (rowIdx) => (segIdx) => (first) => (last) => {
  return mkMove2(rowIdx, segIdx, first, last);
}

function mkMove2(rowIdx, segIdx, first, last) {
  if (last < first) {
    [last, first] = [first, last];
  }

  if (rowIdx === undefined || segIdx === undefined || first === undefined || last === undefined) {
    return {
      rowIdx: -1,
      segIdx: -1,
      first: -1,
      last: -1,
    }
  }
  return {
    rowIdx: rowIdx,
    segIdx: segIdx,
    first: first,
    last: last,
  }
}

export { doMove, mkMove, mkMove2}
export default {doMove, mkMove, mkMove2}
