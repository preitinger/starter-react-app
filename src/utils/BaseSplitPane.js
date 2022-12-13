import {min, max, cssVar} from './Util'
import './BaseSplitPane.css'

const pxToNumber = (s) => {
  const pos = s.indexOf("px");
  if (pos === -1) return null;
  return parseInt(s.slice(0, pos));
}

const SPLITTER_SIZE = pxToNumber(cssVar("--splitter-size"));

const MIN_SIZE = (SPLITTER_SIZE + pxToNumber(cssVar("--min-item-size")));

const indexInParent = (el) => {
  const children = Array.from(el.parentNode.childNodes);
  const idx = children.indexOf(el);
  //console.log("idx=", idx);

  return idx;
}

// gibt Kopie von oldPos zurueck in der die Position der Elemente idx, idx + 1, ... um diff geaendert werden
// Falls das Element an Position idx weiter links als Elemente mit kleinerem
// Index waere, werden diese mit nach links verschoben.
const updatePositions = (oldPos, idx, diff) => {
  let right = oldPos[oldPos.length - 1];
  if (idx === oldPos.length - 1) right += diff;
  const limit = max(
    min(oldPos[idx] + diff, right - MIN_SIZE * (oldPos.length - 1 - idx)),
    MIN_SIZE * idx - SPLITTER_SIZE
  );
  //console.log("updatePositions: idx", idx, "limit", limit);
  const newPos = [];

  for (let i = 0; i < idx; ++i) {
    newPos.push(min(oldPos[i], limit - (idx - i) * MIN_SIZE));
  }

  newPos.push(limit);


  for (let i = idx + 1; i < oldPos.length; ++i) {
    newPos.push(max(
      oldPos[i],
      min(
        limit + (i - idx) * MIN_SIZE,
        right - (oldPos.length - 1 - i) * MIN_SIZE
      )
    ));
  }

  //console.log("newPos", newPos);
  return newPos;
}

export {indexInParent, updatePositions, SPLITTER_SIZE};
