import "./ExitBar.scss";
import { FC, useEffect } from "react";
import { localStorageService } from "../../services/localStorageService";

interface IExitBarProps {
  action: () => void;
}

export const ExitBar: FC<IExitBarProps> = ({ action }) => {
  useEffect(() => {
    if (localStorageService.getIsSessionInProgress() === "true") {
      const closebtn = document.querySelector(".close__btn") as HTMLElement;
      setTimeout(() => {
        closebtn!.style.display = "flex";
      }, 7000);
    }
  }, []);

  return (
    <div className="close__btn__container">
      <button className="close__btn scale-up-center" onClick={action}>
        EXIT
      </button>
    </div>
  );
};
