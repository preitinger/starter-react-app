import {useState, useRef} from 'react'
import '../App.css'
import Msg from './Msg'

const SideItem = (props) => {
  // console.log('SideItem props:', props);
  const [visible, setVisible] = useState(props.initiallyVisible == null ? false : props.initiallyVisible);

  const onClick = () => {
    setVisible(old => (!old));
  }

  return (
    <div className={visible ? "sideItem" : "sideItem sideItem-minified"}>
      <button
        className="sideButton"
        onClick={onClick}>{Msg.sideButtonLabel(props.title, !visible)}
      </button>
      {
        <div className={visible ? "" : "invisible"}>{props.content}</div>
      }
    </div>
  )
}

export default SideItem;
