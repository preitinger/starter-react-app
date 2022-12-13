import '../App.css'
import Row2 from './Row2'

const Board2 = ({
  board, botMove, noneAllowed, onlyAllowedSegId,
  updateOnlyAllowedSegId, doMove
}) => {

  const className = "board2";

  return (
    <div className={className} data-testid='board'>
    {board.rows.map((row, i) =>
      <Row2
      key={row.id}
      row={row}
      botMove={botMove.rowIdx === i ? botMove : null}
      noneAllowed={noneAllowed}
      onlyAllowedSegId={onlyAllowedSegId}
      updateOnlyAllowedSegId={updateOnlyAllowedSegId}
      doMove={doMove(i)}
      />)
    }
    </div>
  )

}

export default Board2
