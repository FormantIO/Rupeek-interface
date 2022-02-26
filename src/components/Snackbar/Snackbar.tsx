import "./Snackbar.scss";
import { CheckIcon } from "../../icons/CheckIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { FC } from "react";

interface ISnackbarprops {
  visible: boolean;
  onclose: () => void;
}

export const Snackbar: FC<ISnackbarprops> = ({ visible, onclose }) => {
  return (
    <div
      onClick={onclose}
      style={{ display: visible ? "flex" : "none" }}
      className="snackbar"
    >
      <CheckIcon />
      <span>Session completed</span>
      <div className="snack-container" onClick={onclose}>
        <CloseIcon color="#fff" size={18} />
      </div>
    </div>
  );
};
