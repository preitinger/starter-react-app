import React from 'react'
import {useState, useRef, useLayoutEffect, useEffect} from 'react'
import './SplitPane.css'

const SplitPane = (props) => {

  const [leftWidth, setLeftWidth] = useState(null);
  const [northHeight, setNorthHeight] = useState(null);
  const [southHeight, setSouthHeight] = useState(null);
  const leftRef = useRef(null);
  const northRef = useRef(null);
  const southRef = useRef(null);

  const onHorMouseDown = (event) => {
    event.preventDefault();
    // const oldX = event.screenX;
    const oldX = event.clientX;
    console.log("oldX=", oldX);
    const oldWidth = leftRef.current.getBoundingClientRect().width;
    console.log("oldWidth=", oldWidth);

      const onMouseMove = (event) => {
        event.preventDefault();
        console.log("oldX=", oldX, ", event.screenX=", event.screenX, ", oldWidth=", oldWidth);
        // const newWidth = oldWidth + (event.screenX - oldX);
        const newWidth = oldWidth + (event.clientX - oldX);
        console.log("newWidth", newWidth);
        setLeftWidth(newWidth);
        console.log("onSplitterMouseMove")
      }

        const onMouseUp = (event) => {
          event.preventDefault();
          console.log("onSplitterMouseUp")
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    console.log("onSplitterMouseDown");
  }

  const onNorthMouseDown = (event) => {
    event.preventDefault();
    // const oldX = event.screenX;
    const oldY = event.clientY;
    console.log("oldY=", oldY);
    const oldHeight = northRef.current.getBoundingClientRect().height;
    console.log("oldHeight=", oldHeight);

      const onMouseMove = (event) => {
        event.preventDefault();
        console.log("oldY=", oldY, ", event.screenY=", event.screenY, ", oldHeight=", oldHeight);
        // const newWidth = oldWidth + (event.screenX - oldX);
        const newHeight = oldHeight + (event.clientY - oldY);
        console.log("newHeight", newHeight);
        setNorthHeight(newHeight);
      }

        const onMouseUp = (event) => {
          event.preventDefault();
          console.log("onSplitterMouseUp")
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    console.log("onSplitterMouseDown");
  }

  const onSouthMouseDown = (event) => {
    event.preventDefault();
    // const oldX = event.screenX;
    const oldY = event.clientY;
    console.log("oldY=", oldY);
    const oldHeight = southRef.current.getBoundingClientRect().height;
    console.log("oldHeight=", oldHeight);

      const onMouseMove = (event) => {
        event.preventDefault();
        console.log("oldY=", oldY, ", event.screenY=", event.screenY, ", oldHeight=", oldHeight);
        // const newWidth = oldWidth + (event.screenX - oldX);
        const newHeight = oldHeight + (oldY - event.clientY);
        console.log("newHeight", newHeight);
        setSouthHeight(newHeight);
      }

        const onMouseUp = (event) => {
          event.preventDefault();
          console.log("onSplitterMouseUp")
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    console.log("onSplitterMouseDown");
  }

  // const calcLeftStyle = () => {
  //   if (leftWidth != null) { // nicht null und nicht undefined wie hier gewollt, da "!=" und nicht "!=="
  //     return {width: Math.round(leftWidth) + "px"};
  //     // return {width: (leftWidth) + "px"};
  //   }
  //   console.log("empty width");
  //   return {};
  // }

  const calcNorthStyle = () => {
    if (northHeight != null) {
      return {height: Math.round(northHeight) + "px"};
    }
  }

  const calcWrapperStyle = () => {
    const st = {};

    if (northHeight != null) {
      st.top = Math.round(northHeight) + "px";
    }

    if (southHeight != null) {
      st.bottom = Math.round(southHeight) + "px";
    }

    return st;
  }

  const calcLeftStyle = () => {
    if (leftWidth != null) { // nicht null und nicht undefined wie hier gewollt, da "!=" und nicht "!=="
      return {width: Math.round(leftWidth) + "px"};
      // return {width: (leftWidth) + "px"};
    }
    console.log("empty width");
    return {};
  }

  const calcRightStyle = () => {
    if (leftWidth != null) {
      return {left: Math.round(leftWidth) + "px"};
    }
  }

  const calcSouthStyle = () => {
    const st = {};

    if (southHeight != null) {
      st.height = Math.round(southHeight) + "px";
    }
    return st;
  }


  return (
    <div className="sp-ywrapper">
      <div ref={northRef} className="sp-north" style={calcNorthStyle()}>
        <div className="sp-northContent">
          {props.north}
        </div>
        <div className="sp-vertSplitter sp-northSplitter"
        onMouseDown={onNorthMouseDown}
        >
        </div>
      </div>
      <div className={props.className ? `sp-wrapper ${props.className}` : "sp-wrapper"} style={calcWrapperStyle()}>
        <div ref={leftRef} className="sp-left" style={calcLeftStyle()}>
        {props.left}
        </div>
        <div className="sp-right" style={calcRightStyle()}>
          <div className="sp-rightContent">
            {props.right}
          </div>
          <div className="sp-horSplitter"
          onMouseDown={onHorMouseDown}
          >
          </div>
        </div>
      </div>
      <div ref={southRef} className="sp-south" style={calcSouthStyle()}>
        <div className="sp-southContent">
          {props.south}
        </div>
        <div className="sp-vertSplitter sp-southSplitter"
        onMouseDown={onSouthMouseDown}
        >
        </div>
      </div>
    </div>
  )
}

export default SplitPane;
