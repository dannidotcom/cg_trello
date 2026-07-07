import React from "react";

import "./Modal.css";

function Modal(props: any) {
  return (
    <div
      className="info"
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className="info-content custom-scroll"
        onClick={(event) => event.stopPropagation()}
      >
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
