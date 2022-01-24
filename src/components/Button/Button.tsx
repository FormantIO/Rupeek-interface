import { FC } from "react";
import "./Button.scss";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  size: "small" | "medium" | "large";
}

export const Button: FC<ButtonProps> = ({
  onClick,
  className,
  children,
  size,
}) => {
  return (
    <button onClick={onClick} className={`btn btn-${size} ${className}`}>
      {children}
    </button>
  );
};
