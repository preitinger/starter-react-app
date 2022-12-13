import './Board.css'
import Row from './Row'
import Pokal from '../res/Pokal.jpeg';

const MyImg = ({visible, src, alt}) => {
  return (
    <div className={visible ? "boardHourGlass boardHourGlassVisible" : "boardHourGlass"}>
      <img className="boardHourGlass-inner" border="0" src={src} alt={alt} />
    </div>
  )
}

const Congratulation = ({text}) => {
  return text ? (
    <div className="congratulation">
      <h3>{text}</h3>
      <img border="1" src={Pokal} alt="Pokal" />
    </div>
  ) : null;
}

const Board = ({
  board, botMove, noneAllowed, onlyAllowedSegId, hourGlass, congratulation,
  updateOnlyAllowedSegId, updateTmpXor, doMove
}) => {

  const className = "board";

  return (
    <div className="boardParent">
    <div className={className} data-testid='board'>
    <Congratulation text={congratulation}/>
    <MyImg visible={hourGlass} src="https://www.123gif.de/gifs/uhren/uhren-0116.gif" alt="uhren-0116.gif von 123gif.de" />
    {board.rows.map((row, i) =>
      <Row
      key={row.id}
      row={row}
      botMove={botMove && botMove.rowIdx === i ? botMove : null}
      noneAllowed={noneAllowed}
      onlyAllowedSegId={onlyAllowedSegId}
      updateOnlyAllowedSegId={updateOnlyAllowedSegId}
      updateTmpXor={updateTmpXor}
      doMove={doMove(i)}
      />)
    }
    </div>
    </div>
  )

}

export default Board
