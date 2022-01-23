import { FC } from "react";
import "./Button.scss";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
}

const Button: FC<ButtonProps> = ({ onClick, className, children }) => {
  return (
    <button onClick={onClick} className={`btn ${className} `}>
      {children}
    </button>
  );
};

export default Button;
