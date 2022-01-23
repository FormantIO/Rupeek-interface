import "./Popup.scss";
import Button from "../Button/Button";
import { CloseIcon } from "../../icons/CloseIcon";
import { FC } from "react";
import { sessionResult } from "../../QueueStore";
import { observer } from "mobx-react";

interface PopupProps {
  visible: boolean;
  IclosePopup: (succesful: sessionResult) => void;
}

const Popup: FC<PopupProps> = observer(({ visible, IclosePopup }) => {
  return (
    <div style={{ display: visible ? "flex" : "none" }} className="popup">
      <div
        onClick={() => IclosePopup(sessionResult.notCompleted)}
        className="overlay"
      ></div>
      <div className="container">
        <div className="header">
          <p>SESSION SUCCESSFUL?</p>
          <CloseIcon
            onClick={() => IclosePopup(sessionResult.notCompleted)}
            className="close-icon"
            color="#fff"
            size={24}
          />
        </div>
        <div className="button-container">
          <Button
            onClick={() => IclosePopup(sessionResult.unsuccesful)}
            className="modal-btn dark"
          >
            NO
          </Button>
          <Button
            onClick={() => IclosePopup(sessionResult.successful)}
            className="modal-btn"
          >
            YES
          </Button>
        </div>
      </div>
    </div>
  );
});

export default Popup;
