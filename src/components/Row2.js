import Segment from './Segment'
import {useState, useRef} from 'react'
import '../App.css'

const Row2 = ({
  row, botMove, noneAllowed, onlyAllowedSegId,
  updateOnlyAllowedSegId, doMove
}) => {
  const [segSize, setSegSize] = useState(null)
  console.log("Row: row=", row);
  console.log("doMove", doMove);



  return (
    <div className='row2'>
    <span className={segSize !== null ? 'segSize' : 'segSize hidden'}>{segSize}</span>
    {row.segments.map((seg, i) =>
      <Segment
        key={seg.id}
        seg={seg}
        botMove={botMove != null && botMove.segIdx === i ? botMove : null}
        allowed={!noneAllowed && (onlyAllowedSegId === -1 || onlyAllowedSegId == seg.id)}
        updateOnlyAllowedSegId={updateOnlyAllowedSegId}
        doMove={doMove(i)}
        setSegSize={setSegSize}
      />
    )}
    </div>
  )
}

export default Row2
