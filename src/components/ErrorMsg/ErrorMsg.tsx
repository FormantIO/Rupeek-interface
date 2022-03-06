import styles from "./ErrorMsg.module.scss";
import { FC, useEffect } from "react";
import { WarningIcon } from "./WarningIcon";
import { CloseIcon } from "./CloseIcon";

interface IErrorMsgProps {
  msg: string;
  onClose: () => void;
}

export const ErrorMsg: FC<IErrorMsgProps> = ({ msg, onClose }) => {
  useEffect(() => {
    const errorMessage = document.getElementById("error-msg");
    errorMessage?.classList.remove("slide-right");
    errorMessage?.classList.add("slide-left");
    setTimeout(() => {
      errorMessage?.classList.remove("slide-left");
      errorMessage?.classList.add("slide-right");
      setTimeout(() => onClose(), 1000);
    }, 10000);
  }, []);

  return (
    <div id="error-msg" className={styles.error}>
      <div className={styles["error-icon"]}>
        <WarningIcon />
        <p>{`Warning: ${msg}`}</p>
      </div>
      <div
        onClick={() => {
          const errorMessage = document.getElementById("error-msg");
          errorMessage?.classList.remove("slide-left");
          errorMessage?.classList.add("slide-right");
          setTimeout(() => onClose(), 1000);
        }}
        className={styles["error-close"]}
      >
        <CloseIcon />
      </div>
    </div>
  );
};
