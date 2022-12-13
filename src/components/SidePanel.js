// @flow
import {useState, useEffect, useRef} from 'react'
import produce from 'immer';
import '../App.css'
import '../utils/Radio.css'
import SideItem from './SideItem'
import Msg from './Msg'
import React from 'react';
import {xorSum} from '../Board'

let originalSettings = null;
const DELAY_MS = 1000;

const SidePanel = ({state, onSettingsUpdate}) => {
  // console.log("SidePanel: onSettingsUpdate=", onSettingsUpdate);
  // console.log("SidePanel: state=", state);
  if (!originalSettings) originalSettings = state.settings;
  const [tmpSettings, setTmpSettings] = useState(state.settings);
  useEffect(() => {
    if (tmpSettings !== state.settings) {
      onSettingsUpdate(tmpSettings);
    }
  }, [tmpSettings])

  const MAX_ROW_COUNT = 50;
  const MAX_ANIMATION_MS = 3000;

  // console.log("originalSettings", originalSettings);
  // console.log("state.settings", state.settings);
  // console.log("tmpSettings", tmpSettings);

  const numRowsChange = (event) => {
    let rowCount = parseInt(event.target.value);
    if (isNaN(rowCount)) {
      rowCount = 0;
    }
    if (!isNaN(rowCount)) {
      setTmpSettings(produce(tmpSettings, draft => {
        if (rowCount < 0) rowCount = 1;
        if (rowCount > MAX_ROW_COUNT) rowCount = MAX_ROW_COUNT;
        draft.game.rowCount = rowCount;
        }))
    }
  }
  const animationMsChange = player => (event) => {
    let ms = parseInt(event.target.value);
    if (isNaN(ms)) {
      ms = 0;
    }

    if (!isNaN(ms)) {
      setTmpSettings(produce(tmpSettings, draft => {
        if (ms < 0) ms = 0;
        if (ms > MAX_ANIMATION_MS) ms = MAX_ANIMATION_MS;
        draft.botMoves[player].animationMs = ms;
      }))
    }
  }
  const botChange = (event) => {
    setTmpSettings(produce(tmpSettings, draft => {
      draft.game.bots[event.target.name] = event.target.checked;
    }))
  }
  const lastWinsChange = (event) => {
    // console.log("lastWinsChange entered");
    setTmpSettings(produce(tmpSettings, draft => {
      draft.game.lastWins = (
        event.target.value === "win" && event.target.checked
      ) || (
        event.target.value === "loose" && !event.target.checked
      )
      // console.log("new lastWins", draft.game.lastWins);
    }))
  }
  const priorityChange = player => (event) => {
    console.log("priorityChange: player=", player + ", event.target.value=", event.target.value);
    if (event.target.checked) {
      setTmpSettings(produce(tmpSettings, draft => {
        draft.botMoves[player].priority = event.target.value
      }))
    }
  }

  const botMoveSettings = (player) =>
  <fieldset>
    <legend>{Msg.forAtOnce(player)}</legend>
    <fieldset>
      <legend>{Msg.priority()}</legend>
      <table>
        <tbody>
          <tr>
            <td>
              <label htmlFor={"random" + player}>{Msg.random()}</label>
            </td>
            <td>
              <input type="radio" id={"random" + player} name={"priority" + player}
              checked={tmpSettings.botMoves[player].priority === "random"}
              onChange={priorityChange(player)}
              value="random" className="input"/>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor={"short" + player}>{Msg.short()}</label>
            </td>
            <td>
              <input type="radio" id={"short" + player} name={"priority" + player}
              checked={tmpSettings.botMoves[player].priority === "short"}
              onChange={priorityChange(player)}
              value="short" className="input"/>
            </td>
          </tr>
          <tr>
            <td>
              <label htmlFor={"long" + player}>{Msg.long()}</label>
            </td>
            <td>
              <input type="radio" id={"long" + player} name={"priority" + player}
              checked={tmpSettings.botMoves[player].priority === "long"}
              onChange={priorityChange(player)}
              value="long" className="input"/>
            </td>
          </tr>
        </tbody>
      </table>
    </fieldset>
    <table>
      <tbody>
        <tr>
          <td>
            <label htmlFor={"animationMs" + player}>{Msg.animationMs()}</label>
          </td>
          <td>
            <input type="number" id={"animationMs" + player}
            value={tmpSettings.botMoves[player].animationMs}
            min={0}
            max={3000}
            onChange={animationMsChange(player)}/>
          </td>
        </tr>
      </tbody>
    </table>
  </fieldset>;

  const binSplit = (x) => {
    let max = 1;
    while (x >= max) max <<= 1;
    max >>= 1;
    console.log("max", max);;
    let res = "" + max;
    x -= max;

    while (x > 0) {
      max >>= 1;

      if (x >= max) {
        x -= max;
        res += " + " + max;
      }
    }

    if (x !== 0) {
      console.error(x);
    }

    return res;
  }

  const xorWithTmp = () => {
    const sum = xorSum(state.board) ^ state.tmpXor;
    return sum + " = " + binSplit(sum);
  }

  return (
    <div className="sidePanel">
      <SideItem initiallyVisible={false} title={Msg.settings()} content=
      {
        <>
        <fieldset>
          <legend>{Msg.forNextGame()}</legend>
          <table>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="numRows">
                    {Msg.numRows()}
                  </label>
                </td>
                <td>
                  <input id="numRows" type="number" min={0} max={MAX_ROW_COUNT} defaultValue={tmpSettings.game.rowCount} onInput={numRowsChange} className="input"/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="bot0">
                  {Msg.botPlaying(0)}
                  </label>
                </td>
                <td>
                  <input id="bot0" name="0" type="checkbox" checked={tmpSettings.game.bots[0]}
                  onChange={botChange} className="input"/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="bot1">
                  {Msg.botPlaying(1)}
                  </label>
                </td>
                <td>
                  <input id="bot1" name="1" type="checkbox" checked={tmpSettings.game.bots[1]}
                  onChange={botChange} className="input"/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="lastWins">
                  {Msg.lastWins()}
                  </label>
                </td>
                <td>
                  <input id="lastWins" name="lastWins" type="radio" value="win" checked={tmpSettings.game.lastWins}
                  onChange={lastWinsChange} className="input"/>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="lastLooses">
                  {Msg.lastLooses()}
                  </label>
                </td>
                <td>
                  <input id="lastLooses" name="lastWins" type="radio" value="loose" checked={!tmpSettings.game.lastWins}
                  onChange={lastWinsChange} className="input"/>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
        {botMoveSettings(0)}
        {botMoveSettings(1)}
        </>
      }
      />
      <SideItem title={Msg.rules()} initiallyVisible={true} content={
        <div className="rules">
        {Msg.rulesContent()}
        </div>
      }/>
      <SideItem title={Msg.tip(0)} initiallyVisible={false} content={
        <p>{Msg.tip0()}</p>
      }/>
      <SideItem title={Msg.tip(1)} initiallyVisible={false} content={
        <p>{Msg.tip1()}</p>
      }/>
      <SideItem title={Msg.tip(2)} initiallyVisible={false} content={
        <p>{Msg.tip2()}</p>
      }/>
      <SideItem title={Msg.tip(3)} initiallyVisible={false} content={
        <p>{Msg.tip3()}</p>
      }/>
      <SideItem title={Msg.tip(4)} initiallyVisible={false} content={
        <p>{Msg.tip4(xorSum(state.board))}</p>
      }/>
      <SideItem title={Msg.tip(5)} initiallyVisible={false} content={
        <p>{binSplit(xorSum(state.board))}</p>
      }/>
      <SideItem title={Msg.tip(6)} content={
        <p>{xorWithTmp()}</p>
      }/>
    </div>
  )
}

export default SidePanel
