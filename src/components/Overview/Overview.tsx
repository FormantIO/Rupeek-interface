import { useRef, useEffect, FC } from "react";
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

  let closebtn = document.querySelector(".close__btn") as HTMLElement;

  useEffect(() => {
    props.DeviceStore.setDevicesInQueue(0);

    if (closebtn) closebtn!.style.display = "none";
    if (props.DeviceStore.isSessionInProgress) {
      setTimeout(() => {
        closebtn!.style.display = "flex";
      }, 7000);
    }
  }, [props.DeviceStore.isSessionInProgress]);

  const spotId = "2c18bc8b-c5e4-4ea0-8886-a8363d185597";
  const turtleBotId = "c0fa284e-09ee-4080-9d0f-560592e27929";

  return (
    <div className="overview__container">
      <Devices quantity={props.DeviceStore.devicesInQueue} />
      {props.DeviceStore.isSessionInProgress && (
        <iframe
          id="sessionWindow"
          ref={iframeSession}
          className="session__frame"
          src={props.DeviceStore.teleopUrl!}
        >
          {}
        </iframe>
      )}
      <div className="main__conatiner">
        <DeviceIcon size={48} color="white" />
        <div className="text__container">
          <p>Device Available</p>
        </div>
        <div className="main__button__container">
          <CustomButton
            onClick={() => {
              props.DeviceStore.startTeleopSession(turtleBotId);
            }}
            label="START SESSION"
          />
        </div>
      </div>
      <div className="close__btn__container">
        <button
          className="close__btn"
          onClick={() => {
            props.DeviceStore.closeSession();
          }}
        >
          EXIT
        </button>
      </div>
    </div>
  );
});

export default Overview;
