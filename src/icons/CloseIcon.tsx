import { FC } from "react";
interface CloseIconProps {
  size: number;
  color: string;
  hover?: string;
  className?: string;
  onClick?: () => void;
}

export const CloseIcon: FC<CloseIconProps> = ({
  size,
  color,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`devices__conatiner__icon__holder ${className}`}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.293 18.7071L5.29297 6.70711L6.70718 5.29289L18.7072 17.2929L17.293 18.7071Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M6.70703 18.7071L18.707 6.70711L17.2928 5.29289L5.29282 17.2929L6.70703 18.7071Z"
          fill={color}
        />
      </svg>
    </div>
  );
};
