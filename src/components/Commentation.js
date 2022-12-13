import '../App.css'
import Msg from './Msg'

const Commentation = ({state, undoClick}) => {
  const gameRunning = state.player >= 0;
  let isBot = (gameRunning && state.settings.game.bots[state.player]);
  const oneBot = (state.settings.game.bots[0] !== state.settings.game.bots[1]);
  console.log("commentation: gameRunning", gameRunning, ", state.winner", state.winner);

  return (
    <div className="commentation">
      <p className="lightHint">
        {Msg.currentVariant()}
        <em>
          {Msg.lastWinsVariant(state.settings.game.lastWins)}
        </em>
      </p>
      <p>
      {
        state.winner !== -1
        ? Msg.gameOver()
        : (
          gameRunning ? (
            isBot ? (oneBot ? Msg.botsTurn() : Msg.botNrsTurn(state.player))
            : (oneBot ? Msg.humansTurn() : Msg.humanNrsTurn(state.player))
          ) : Msg.requestStart())
      }
      &nbsp;
      {
        state.winner >= 0 && state.settings.game.bots[state.winner] ? // Computer hat gewonnen
        (
          oneBot ? Msg.botHasWon() : Msg.botNrsHasWon(state.winner)
        )
        :
        (
          state.winner >= 0 && !state.settings.game.bots[state.winner] ? // Mensch hat gewonnen
          (
            oneBot ? Msg.humanHasWon() : Msg.humanNrsHasWon(state.winner)
          )
          : // kein gewinner
          null
        )
      }
      </p>
      <p className="lightHint">
      {
        state.winner === -1 && state.player >= 0 && !state.settings.game.bots[state.player] ?
        (state.onlyAllowedSegId === -1 ? Msg.hintClick1() : Msg.hintClick2())
        : null
      }
      </p>
      {
        state.onlyAllowedSegId !== -1 ? <button className="sideButton" onClick={undoClick}>Klick zurücknehmen</button> : null
      }
    </div>
  )
}

export default Commentation;
