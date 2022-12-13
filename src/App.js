import React from 'react'
import './App.css';
import Board from './components/Board'
import SidePanel from './components/SidePanel'
import Move from './Move'
import {mkBoard, gameOver} from './Board'
import {useState, useEffect} from 'react'
import produce from 'immer';
import Msg from './components/Msg'
import BotMove from './BotMove'
import './components/Board.css'
import Commentation from './components/Commentation'
import VSplitPane from './utils/VSplitPane'
import HSplitPane from './utils/HSplitPane'
import SmilingComputer from './res/SmilingComputer.gif'

const makeSettings = () => ({
  game: {
    rowCount: 5,
    bots: [false, true],
    lastWins: false,
  },
  botMoves: [
    {
      animationMs: 500,
      priority: "random", // or "short" or "long"
    },
    {
      animationMs: 500,
      priority: "random", // or "short" or "long"
    },
  ]
})

const evtlStartBotMove = (draft) => {
  if (draft.settings.game.bots[draft.player]) {
    if (draft.botMove.rowIdx === -1) {
      console.log("board before BotMove.query: ", draft.board);
      const {move, willWin} = BotMove.query(draft.board, draft.settings.game.lastWins, draft.settings.botMoves[draft.player].priority);
      if (move == null) {
        console.error("move = null: Spielende noch nicht implementiert");
      } else {
        draft.botMove = move;
        console.log("animationMs", draft.settings.botMoves[draft.player].animationMs);
        draft.botMoveTime = Date.now() + draft.settings.botMoves[draft.player].animationMs;
        console.log("draft.botMove was set to ", move, "botMoveTime to ", draft.botMoveTime);
        if (willWin) {
          draft.preWinner = draft.player;
        }
      }
    }
  }
}


const doMoveAndContinue = (draft, move) => {
  if (move == null || move.rowIdx === -1) {
    // Ausnahmefall, wenn neues Spiel gestartet wird und danach der timeout aktiv wird
    return;
  }

  Move.doMove(draft.board, move);
  draft.player = 1 - draft.player;
  draft.botMove = Move.mkMove2();
  draft.botMoveTime = null;
  draft.tmpXor = 0;

  if (gameOver(draft.board)) {
    console.log("Game over!");
    draft.winner = draft.settings.game.lastWins ? 1 - draft.player : draft.player;
    draft.preWinner = -1;
    draft.player = -1;
    return;
  }

  // wenn Spiel nicht zuende, naechsten Zug beginnen
  evtlStartBotMove(draft);
}

const BOARD_UPDATE_MS = 800;

const App = () => {
  // // TODO begin test
  // return <Root/>
  // // TODO end test


  // console.log("settings", settings);
  const [state, setState] = useState(() => {
    const settings = makeSettings();
    const draft = {
      settings: settings,
      nextSettings: settings,
      pendingBoard: null,
      board: mkBoard(settings.game.rowCount),
      player: -1,
      botMove: null,
      botMoveTime: null,
      onlyAllowedSegId: -1,
      winner: -1,
      preWinner: -1,
      tmpXor: 0
    }
    evtlStartBotMove(draft);
    return draft;
  });

  // Das Callback-Argument von useEffect wird genau einmal nach jedem render- oder re-render-
  // Vorgang aufgerufen.
  useEffect(() => {
    if (state.botMoveTime != null) {
      const timerId = setTimeout(() => {
        setState(s => produce(s, draft => {
          doMoveAndContinue(draft, draft.botMove);
        }))
      }, state.botMoveTime - Date.now());
      return () => {
        clearTimeout(timerId);
      }
    }
  });

  //
  useEffect(() => {
    if (state.pendingBoard != null) {
      const timeoutId = setTimeout(() => {
        setState(s => produce(s, draft => {
          draft.board = draft.pendingBoard;
          draft.pendingBoard = null;
        }))
      }, BOARD_UPDATE_MS)
      return () => {
        clearTimeout(timeoutId);
      }
    }
  }, [state.pendingBoard])



  const onSettingsUpdate = (tmpSettings) => {
    console.log("onSettingsUpdate: tmpSettings=", tmpSettings);

    if (tmpSettings.game.rowCount < 1) {
      tmpSettings = {
        ...tmpSettings,
        game: {
          ...tmpSettings.game,
          rowCount: 1
        }
      }

      console.log("tmpSettings geaendert: ", tmpSettings);
    }
    console.log("tmpSettings", tmpSettings);

      setState(s => produce(s, draft => {
        draft.nextSettings = tmpSettings;

        if (draft.player === -1) {
          draft.settings = tmpSettings;
          draft.pendingBoard = mkBoard(tmpSettings.game.rowCount);
          draft.winner = -1;
        } else {
          draft.settings.botMoves = tmpSettings.botMoves;
        }
      }))
    }

  const updateOnlyAllowedSegId = (segId) => {
    setState(s => produce(s, (draft => {
      draft.onlyAllowedSegId = segId;
    })))
  }

  const doMove = rowIdx => segIdx => (first, last) => {
    // console.warn("in doMove", rowIdx, segIdx, first, last);
    setState(s => produce(s, draft => {
      doMoveAndContinue(draft, {
        rowIdx: rowIdx,
        segIdx: segIdx,
        first: first,
        last: last
      })
    }))
  }

  const onStart = () => {
    setState(s => produce(s, draft => {
      draft.settings = draft.nextSettings;
      draft.board = mkBoard(draft.settings.game.rowCount);
      draft.player = 0;
      draft.botMove = Move.mkMove2(); // initially empty move
      draft.onlyAllowedSegId = -1;
      draft.tmpXor = 0;
      draft.winner = -1;
      draft.preWinner = -1;
      evtlStartBotMove(draft);
    }))
  }

  const undoClick = (event) => {
    console.log("undoClick");
    setState(s => produce(s, draft => {
      draft.onlyAllowedSegId = -1;
      draft.tmpXor = 0;
    }));
  }

  const updateTmpXor = (tmpXor) => {
    setState(s => produce(s, draft => {
      draft.tmpXor = tmpXor;
    }))
  }


  return (
    <VSplitPane list={[

      <div className="oben">
        <div className="oben-0">
          <h1>Checkboxing</h1>
        </div>
        <div className="oben-1">
          <button className="sideButton" onClick={onStart}>{Msg.startGame()}</button>
        </div>
      </div>

      ,

      <HSplitPane list={[

        <VSplitPane list={[

          <Commentation state={state} undoClick={undoClick}/>,

          <div>
          {
            state.preWinner !== -1 ?
            <div>
            <p id="preWinner">
            {state.settings.game.bots[1 - state.preWinner] ? Msg.nrsMightWin(state.preWinner) : Msg.mightWin()}
            </p>
              <img src={SmilingComputer} alt="Computer: ich glaube ich gewinne ;-)"/>
            </div>
            : null
          }
          <SidePanel state={state} onSettingsUpdate={onSettingsUpdate}/>
          </div>

        ]}/>,

          <Board
          board={state.board}
          botMove={state.botMove}
          noneAllowed={state.player === -1 || state.settings.game.bots[state.player]}
          onlyAllowedSegId={state.onlyAllowedSegId}
          hourGlass={state.pendingBoard != null}
          congratulation={
            state.winner >= 0 && !state.settings.game.bots[state.winner] ?
            (
                state.settings.game.bots[1 - state.winner] ? Msg.congrats() : Msg.congratsPlayer(state.winner)
            )
            :
            null
          }
          updateOnlyAllowedSegId={updateOnlyAllowedSegId}
          updateTmpXor={updateTmpXor}
          doMove={doMove}
          />

      ]} initialWidths={["400px"]}/>

      ,

      <p><a href="https://de.freepik.com/vektoren-kostenlos/haekchen-und-kreuzsymbole-in-flachen-stilen_18141266.htm#query=checkbox&position=0&from_view=keyword" target="_blank" rel="noreferrer" >Bild von starline</a> auf Freepik</p>
    ]} initialHeights={[
      "80px",
      "calc(100vh - 80px - 70px)",
      "70px"
    ]}/>
  )
}

export default App;
