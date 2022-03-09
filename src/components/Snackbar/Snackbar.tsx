import "./Snackbar.scss";
import { CheckIcon } from "../../icons/CheckIcon";
import { CloseIcon } from "../../icons/CloseIcon";
import { FC, useEffect } from "react";

interface ISnackbarprops {
  visible: boolean;
  hideSnackBar: () => void;
}

export const Snackbar: FC<ISnackbarprops> = ({ visible, hideSnackBar }) => {
  useEffect(() => {
    const snackBar = document.getElementById("snackBar");
    if (visible) {
      setTimeout(() => {
        snackBar?.classList.remove("slide-right");
        snackBar?.classList.add("slide-left");
        setTimeout(() => {
          snackBar?.classList.remove("slide-left");
          snackBar?.classList.add("slide-right");
          hideSnackBar();
        }, 3000);
      }, 1000);
    }
  }, [visible]);

  return (
    <div className="snackbar" id="snackBar">
      <CheckIcon />
      <span>Session completed</span>
      <div
        className="snack-container"
        onClick={() => {
          const snackBar = document.getElementById("snackBar");
          snackBar?.classList.remove("slide-left");
          snackBar?.classList.add("slide-right");
          hideSnackBar();
        }}
      >
        <CloseIcon color="#fff" size={18} />
      </div>
    </div>
  );
};
