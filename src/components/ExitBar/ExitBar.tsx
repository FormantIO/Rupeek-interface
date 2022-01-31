import "./ExitBar.scss";
import { FC } from "react";

interface IExitBarProps {
  action: () => void;
}

export const ExitBar: FC<IExitBarProps> = ({ action }) => {
  return (
    <div className="close__btn__container">
      <button className="close__btn scale-up-center" onClick={action}>
        EXIT
      </button>
    </div>
  );
};
