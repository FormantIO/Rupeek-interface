import "./Popup.scss";
import { Button } from "../Button/Button";
import { CloseIcon } from "../../icons/CloseIcon";
import { FC } from "react";
import { sessionResult } from "../../QueueStore";
import { observer } from "mobx-react";

interface PopupProps {
  visible: boolean;
  ISetSessionState: (succesful: sessionResult) => void;
}

export const Popup: FC<PopupProps> = observer(
  ({ visible, ISetSessionState }) => {
    return (
      <div
        id="popup"
        style={{ display: visible ? "flex" : "none" }}
        className="popup"
      >
        <div
          onClick={() => ISetSessionState(sessionResult.notDoneYet)}
          className="overlay"
        ></div>
        <div className="container">
          <div className="header">
            <p>SESSION SUCCESSFUL?</p>
            <CloseIcon
              onClick={() => ISetSessionState(sessionResult.notDoneYet)}
              className="close-icon"
              color="#fff"
              size={24}
            />
          </div>
          <div className="button-container">
            <Button
              size="small"
              onClick={() => ISetSessionState(sessionResult.unsuccesful)}
              className="modal-btn dark"
            >
              NO
            </Button>
            <Button
              size="small"
              onClick={() => ISetSessionState(sessionResult.successful)}
              className="modal-btn"
            >
              YES
            </Button>
          </div>
        </div>
      </div>
    );
  }
);
