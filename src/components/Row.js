import Segment from './Segment'
import './Row.css'
import {useState, useRef} from 'react'

const Row = ({
  row, botMove, noneAllowed, onlyAllowedSegId,
  updateOnlyAllowedSegId, updateTmpXor, doMove
}) => {
  const [segSize, setSegSize] = useState(null)
  // console.log("Row: row=", row);
  // console.log("doMove", doMove);



  return (
    <div className='row'>
    <span className={segSize !== null ? 'segSize' : 'segSize invisible'}>{segSize}</span>
    {row.segments.map((seg, i) =>
      <Segment
        key={seg.id}
        seg={seg}
        botMove={botMove != null && botMove.segIdx === i ? botMove : null}
        allowed={!noneAllowed && (onlyAllowedSegId === -1 || onlyAllowedSegId === seg.id)}
        reset={onlyAllowedSegId === -1 || onlyAllowedSegId !== seg.id}
        updateOnlyAllowedSegId={updateOnlyAllowedSegId}
        updateTmpXor={updateTmpXor}
        doMove={doMove(i)}
        setSegSize={setSegSize}
      />
    )}
    </div>
  )
}

export default Row
