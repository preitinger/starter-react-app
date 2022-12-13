import React from 'react'
import {useState, useRef, useEffect} from 'react'
import './BaseSplitPane.css'
import {updatePositions, SPLITTER_SIZE} from './BaseSplitPane'

// An manchen Stellen heißen Variable left bzw. right, aber gemeint ist dann oft top bzw. bottom

const VSplitPane = ({list, initialHeights}) => {

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
        containerRef.current.clientHeight - pos1[pos1.length - 1]);

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
    if (i == null) console.error(i);
    const it = list[i];
    if (it == null) console.error(i, it);

    let style = {};

    if (pos != null) {
      if (pos[i] == null) console.error("pos", pos, "i", i);
      const left = (i === 0 ? 0 : pos[i] + SPLITTER_SIZE);
      const height = (pos[i + 1] - left);
      // console.log("vert - pos=", pos);
      // console.log("left=", left, ", height=", height);
      // console.log("left", left);
      style = {
        top: left + "px",
        height: height + "px"
      };
    } else if (initialHeights && initialHeights[i]) {
      style = {
        height: initialHeights[i]
      };
    }
    return (
      <div key={i * 2} className="vsp-item"
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
      res.push(l[i].offsetTop);
    }

    // als letzten Eintrag den rechten Rand, d.h. die Breite von containerRef.current:
    res.push(containerRef.current.clientHeight);
    // console.log("vert - scanPositions liefert ", res);
    return res;
  }

  const onMouseDown = (idx) => (event) => {
    event.preventDefault();
    // const oldLeft = event.target.offsetLeft;
    // const oldScreenY = event.screenY;
    const oldScreenY = event.pageY;
    const pos1 = (pos == null ? scanPositions() : pos);

    const onMouseMove = (event) => {
      event.preventDefault();
      const y = event.pageY;
      setPos(updatePositions(pos1, idx, y - oldScreenY, containerRef.current.clientHeight));
    }

    const onMouseUp = (event) => {
      event.preventDefault();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  const splitter = (i) => {
    // return (
    //   <div key={i * 2 - 1} className="vsp-splitter" onMouseDown={onMouseDown}
    //   style={pos == null ? {} : {top: pos[i] + "px", height: SPLITTER_SIZE + "px"}}>
    //   </div>
    // )

    return (
      <div key={i * 2 - 1} className="vsp-splitter-outer" onMouseDown={onMouseDown(i)}
      style={pos == null ? {} : {top: pos[i] + "px", height: SPLITTER_SIZE + "px"}}>
        <div className="vsp-splitter-inner">
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
    <div ref={containerRef} className={"vsp-container" + (pos == null ? " vsp-default" : "")}>
      {children}
    </div>
  )
}

export default VSplitPane;
