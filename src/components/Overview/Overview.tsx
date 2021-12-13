import { useRef, useState, useEffect, FC } from "react";
import "./Overview.scss";
import CustomButton from "../CustomButton/CustomButton";
import Devices from "../Devices/Devices";
import { QueueStore } from "../../QueueStore";
import { observer } from "mobx-react";
import { DeviceIcon } from "../../icons/DeviceIcon";

interface OverviewProps {
  DeviceStore: QueueStore;
}

const Overview: FC<OverviewProps> = observer((props) => {
  const iframeSession = useRef(null);

  const [deviceState, setDeviceState] = useState<string>("Device available");

  useEffect(() => {
    props.DeviceStore.setDevicesInQueue(0);

    let token = localStorage.getItem("refreshToken") || undefined;
    window.addEventListener("message", function (ev) {
      if (ev.data === "close") {
        props.DeviceStore.closeSession();
      }
      return;
    });
  }, []);

  const spotId = "2c18bc8b-c5e4-4ea0-8886-a8363d185597";

  return (
    <div className="overview__container">
      <Devices quantity={props.DeviceStore.devicesInQueue} />
      {props.DeviceStore.isSessionInProgress && (
        <iframe
          ref={iframeSession}
          className="session__frame"
          src={props.DeviceStore.teleopUrl!}
        ></iframe>
      )}
      <div className="main__conatiner">
        <DeviceIcon size={48} color="white" />
        <div className="text__container">
          <p>{deviceState}</p>
        </div>
        <div className="main__button__container">
          <CustomButton
            onClick={() => {
              props.DeviceStore.startSession(spotId);
            }}
            label="START SESSION"
          />
        </div>
      </div>
    </div>
  );
});

export default Overview;
