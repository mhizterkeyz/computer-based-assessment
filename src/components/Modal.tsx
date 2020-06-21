import React from "react";
import ModalBox from "react-bootstrap/Modal";

const Modal = (props: any) => {
  return (
    <ModalBox show={props.show} onHide={props.handleClose} centered>
      <ModalBox.Body style={{ borderColor: "#ffffff" }}>
        {props.children}
      </ModalBox.Body>
    </ModalBox>
  );
};

export default Modal;
