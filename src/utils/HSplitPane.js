import React from 'react'
import {useState, useRef, useEffect} from 'react'
import './BaseSplitPane.css'
import {updatePositions, SPLITTER_SIZE} from './BaseSplitPane'

const HSplitPane = ({list, initialWidths}) => {

  const [pos, setPos] = useState(null);
  const containerRef = useRef(null);
  useEffect(() => {
    if (pos == null) {
      setPos(scanPositions());
    }
  }, [pos])

  useEffect(() => {
    if (!window.ResizeObserver) return;
    const resizeObserver = new ResizeObserver(() => {
      const pos1 = (pos == null ? scanPositions() : pos);
      const newPos = updatePositions(pos1, pos1.length - 1,
        containerRef.current.clientWidth - pos1[pos1.length - 1]);
      // console.log("resize: newPos", newPos);

      let diff = false;

      for (let i = 0; i < newPos.length; ++i) {
        if (newPos[i] !== pos1[i]) {
          diff = true;
          break;
        }
      }
      if (!diff) return;
      setPos(newPos);
    })

    resizeObserver.observe(containerRef.current);

    return (() => {
      resizeObserver.disconnect();
    })
  }, [pos])

  const item = (i) => {
    const it = list[i];
    let style = {};

    if (pos != null) {
      const left = (i === 0 ? 0 : pos[i] + SPLITTER_SIZE);
      // console.log("left", left);
      style = {
        left: left + "px",
        width: (pos[i + 1] - left) + "px"
      };
    } else if (initialWidths && initialWidths[i]) {
      style = {
        width: initialWidths[i]
      };
    }
    return (
      <div key={i * 2} className="hsp-item"
      style={style}
      >
        {it}
      </div>
    )
  }

  const scanPositions = () => {
    let res = [];
    const l = Array.from(containerRef.current.childNodes);

    res.push(0);

    // Nur ueber die Splitter-Kinder iterieren:
    for (let i = 1; i < l.length; i += 2) {
      res.push(l[i].offsetLeft);
    }

    // als letzten Eintrag den rechten Rand, d.h. die Breite von containerRef.current:
    res.push(containerRef.current.clientWidth);
    //console.log("scanPositions liefert ", res);
    //console.log("l[0].offsetLeft waere ", l[0].offsetLeft);
    return res;
  }

  const onMouseDown = (idx) => (event) => {
    event.preventDefault();
    // const oldLeft = event.target.offsetLeft;
    const oldScreenX = event.pageX;
    const pos1 = (pos == null ? scanPositions() : pos);

    const onMouseMove = (event) => {
      event.preventDefault();
      const x = event.pageX;
      setPos(updatePositions(pos1, idx, x - oldScreenX, containerRef.current.clientWidth));
    }

    const onMouseUp = (event) => {
      event.preventDefault();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    // window.addEventListener('mouseout', onMouseUp);
  }

  const splitter = (i) => {
    // return (
    //   <div key={i * 2 - 1} className="hsp-splitter" onMouseDown={onMouseDown}
    //   style={pos == null ? {} : {left: pos[i] + "px", width: SPLITTER_SIZE + "px"}}>
    //   </div>
    // )

    return (
      <div key={i * 2 - 1} className="hsp-splitter-outer" onMouseDown={onMouseDown(i)}
      style={pos == null ? {} : {left: pos[i] + "px", width: SPLITTER_SIZE + "px"}}>
        <div className="hsp-splitter-inner">
        </div>
      </div>
    )
  }

  const children = [];
  if (list.length > 0) {
    children.push(item(0));
  }

  for (let i = 1; i < list.length; ++i) {
    children.push(splitter(i));
    children.push(item(i));
  }

  return (
    <div ref={containerRef} className={"hsp-container" + (pos == null ? " hsp-default" : "")}

    >
      {children}
    </div>
  )
}

export default HSplitPane;
