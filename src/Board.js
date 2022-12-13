import nextId from './nextId'
const mkSeg = (size) => {
  return {
    id: nextId(),
    size: size,
    checked: false,
  }
}

const mkRow = (size) => {
  return {
    id: nextId(),
    segments: [mkSeg(size)]
  }
}

const mkBoard = (size) => {
  const rows = []

  for (let i = 0; i < size; ++i) {
    rows.push(mkRow(i + 1))
  }

  return {
    rows: rows
  }
}

const xorSum = (board) => {
  let x = 0;
  for (let i = 0; i < board.rows.length; ++i) {
    for (let j = 0; j < board.rows[i].segments.length; ++j) {
      if (!board.rows[i].segments[j].checked) {
        x ^= board.rows[i].segments[j].size;
      }
    }
  }

  return x;
}

const gameOver = board => {
  const rows = board.rows;
  for (let i = 0; i < rows.length; ++i) {
    const segments = rows[i].segments;
    for (let j = 0; j < segments.length; ++j) {
      if (!segments[j].checked) return false;
    }
  }
  return true;
}

export {mkBoard, mkRow, mkSeg, xorSum, gameOver}
