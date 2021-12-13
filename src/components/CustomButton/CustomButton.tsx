import { FC } from "react";
import "./CustomButton.scss";

interface CustomButtonProps {
  label: string;
  onClick?: () => void;
}

const CustomButton: FC<CustomButtonProps> = (props) => {
  return (
    <button onClick={props.onClick} className="btn">
      {props.label}
    </button>
  );
};

export default CustomButton;
