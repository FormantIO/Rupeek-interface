import { useEffect, FC } from "react";
import "./Overview.scss";
import Button from "../Button/Button";
import Devices from "../Devices/Devices";
import { QueueStore } from "../../QueueStore";
import { observer } from "mobx-react";
import { DeviceIcon } from "../../icons/DeviceIcon";
import Popup from "../PopUp/Popup";
import { sessionResult } from "../../QueueStore";

interface OverviewProps {
  DeviceStore: QueueStore;
}

const Overview: FC<OverviewProps> = observer((props) => {
  let closebtn = document.querySelector(".close__btn") as HTMLElement;

  useEffect(() => {
    // props.DeviceStore.setDevicesInQueue();
    if (closebtn) closebtn!.style.display = "none";
    if (props.DeviceStore.isSessionInProgress) {
      setTimeout(() => {
        closebtn!.style.display = "flex";
      }, 7000);
    }
  }, [props.DeviceStore.isSessionInProgress]);

  const spotId = "2c18bc8b-c5e4-4ea0-8886-a8363d185597";
  const turtleBotId = "c0fa284e-09ee-4080-9d0f-560592e27929";

  const sessionResolution = (_: sessionResult) => {
    props.DeviceStore.closePopup(_);
  };

  return (
    <div className="overview__container">
      <Popup
        IclosePopup={sessionResolution}
        visible={props.DeviceStore.IWantToExit}
      />
      <Devices quantity={props.DeviceStore.devicesInQueue} />
      {props.DeviceStore.isSessionInProgress && (
        <iframe
          id="sessionWindow"
          className="session__frame"
          src={props.DeviceStore.teleopUrl!}
        />
      )}
      <div className="main__conatiner">
        <DeviceIcon size={48} color="white" />
        <div className="text__container">
          <p>Device Available</p>
        </div>
        <div className="main__button__container">
          <Button
            onClick={() => {
              props.DeviceStore.startTeleopSession(turtleBotId);
            }}
          >
            START SESSION
          </Button>
        </div>
      </div>
      <div className="close__btn__container">
        <button
          className="close__btn scale-up-center"
          onClick={() => {
            props.DeviceStore.completeSession();
            // let iframe = document.getElementById("sessionWindow");
            // iframe?.classList.add("scale-out-bl");
            // setTimeout(() => {
            //   props.DeviceStore.closeSession();
            // }, 200);
          }}
        >
          EXIT
        </button>
      </div>
    </div>
  );
});

export default Overview;
