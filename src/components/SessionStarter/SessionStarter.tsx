import { DeviceIcon } from "../../icons/DeviceIcon";
import { Button } from "../Button/Button";
import "./SessionStarter.scss";
import { FC } from "react";
import loading from "../../../src/components/images/loading.png";

interface ISessionStarterProps {
  action: () => void;
  devicesAvailable: boolean;
  isLoading: boolean;
}

export const SessionStarter: FC<ISessionStarterProps> = ({
  action,
  devicesAvailable,
  isLoading,
}) => {
  return (
    <div className="main__conatiner">
      {isLoading ? (
        <img src={loading} />
      ) : (
        <>
          <DeviceIcon size={48} color="white" />
          <div className="text__container">
            <p>
              {devicesAvailable
                ? "Device Available"
                : "Currently no devices need assistance"}
            </p>
          </div>
          <div className="main__button__container">
            <Button size="large" onClick={action}>
              {devicesAvailable ? "START SESSION" : "REFRESH"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
