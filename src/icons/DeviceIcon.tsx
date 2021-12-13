import { FC } from "react";
interface DeviceIconProps {
  size: number;
  color: string;
}

export const DeviceIcon: FC<DeviceIconProps> = ({ size, color }) => {
  return (
    <div className="devices__conatiner__icon__holder">
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M27 15.4005V15.3994C27 13.7428 25.6571 12.3999 24.0005 12.3999C22.344 12.3999 21.0011 13.7428 21.0011 15.3994V15.4005C21.0011 17.057 22.344 18.3999 24.0005 18.3999C25.6571 18.3999 27 17.057 27 15.4005Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M38.6001 5.90448C40.2713 8.57166 41.2375 11.7257 41.2375 15.1053C41.2375 18.4191 40.3087 21.5159 38.6971 24.1495L36.9506 23.171C38.4006 20.8272 39.2375 18.064 39.2375 15.1053C39.2375 12.0807 38.3628 9.26029 36.8526 6.88336L38.6001 5.90448ZM9.13243 24.245C7.48464 21.5908 6.53313 18.4592 6.53313 15.1053C6.53313 11.6855 7.52245 8.4967 9.2305 5.80957L10.9787 6.78882C9.43124 9.18535 8.53313 12.0405 8.53313 15.1053C8.53313 18.1042 9.39294 20.9021 10.8795 23.2662L9.13243 24.245ZM34.9048 22.0249C36.166 20.0207 36.8955 17.6483 36.8955 15.1054C36.8955 12.4964 36.1275 10.0667 34.8053 8.03018L33.0558 9.01018C34.2181 10.7554 34.8955 12.8513 34.8955 15.1054C34.8955 17.2932 34.2574 19.332 33.1571 21.0458L34.9048 22.0249ZM14.6748 21.14L12.9261 22.1197C11.628 20.0957 10.8752 17.6884 10.8752 15.1054C10.8752 12.4562 11.6671 9.99184 13.027 7.93624L14.7777 8.91692C13.577 10.6805 12.8752 12.811 12.8752 15.1054C12.8752 17.3335 13.537 19.4069 14.6748 21.14ZM31.1106 19.8992C32.0223 18.5268 32.5535 16.8798 32.5535 15.1087V15.1055C32.5535 13.2669 31.981 11.5619 31.0046 10.1592L29.2487 11.1428C30.0686 12.2506 30.5535 13.6214 30.5535 15.1055V15.1087C30.5535 16.5249 30.1119 17.838 29.359 18.9179L31.1106 19.8992ZM18.4769 19.0098L16.723 19.9924C15.7729 18.6017 15.2173 16.9201 15.2173 15.1087V15.1055C15.2173 13.2265 15.8152 11.4871 16.8311 10.0672L18.59 11.0525C17.729 12.1757 17.2173 13.5808 17.2173 15.1055V15.1087C17.2173 16.5653 17.6844 17.9129 18.4769 19.0098Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.2515 35.0002H22V33.0002H26.2515V35.0002Z"
          fill={color}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 30C10 27.7909 11.7909 26 14 26H34C36.2091 26 38 27.7909 38 30V38C38 40.2091 36.2091 42 34 42H14C11.7909 42 10 40.2091 10 38V30ZM34 30H14V38H34V30Z"
          fill={color}
        />
      </svg>
    </div>
  );
};
