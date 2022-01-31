import { useEffect, FC } from "react";
import "./Overview.scss";
import { Devices } from "../Devices/Devices";
import { QueueStore } from "../../QueueStore";
import { observer } from "mobx-react";
import { Popup } from "../PopUp/Popup";
import { sessionResult } from "../../QueueStore";
import { fadeIn } from "../../Utils/fadeIn";
import { fadeOut } from "../../Utils/fadeOut";
import { SessionStarter } from "../SessionStarter/SessionStarter";
import { ExitBar } from "../ExitBar/ExitBar";

interface OverviewProps {
  DeviceStore: QueueStore;
}

const Overview: FC<OverviewProps> = observer(({ DeviceStore }) => {
  const { isSessionInProgress, isPopupOpen, devicesInQueue, teleopUrl } =
    DeviceStore;

  const closebtn = document.querySelector(".close__btn") as HTMLElement;
  const popup = document.getElementById("popup");
  const spotId = "2c18bc8b-c5e4-4ea0-8886-a8363d185597";
  const turtleBotId = "c0fa284e-09ee-4080-9d0f-560592e27929";

  useEffect(() => {
    if (closebtn) closebtn!.style.display = "none";
    if (isSessionInProgress) {
      setTimeout(() => {
        closebtn!.style.display = "flex";
      }, 7000);
    }
  }, [isSessionInProgress]);

  const sessionResolution = (_: sessionResult) => {
    if (_ === sessionResult.successful || _ === sessionResult.unsuccesful) {
      fadeOut(popup!);
      DeviceStore.setSessionState(_);
    } else if (_ === sessionResult.notDoneYet) fadeOut(popup!);
  };

  const sessionAction = () => {
    if (devicesInQueue > 0) {
      DeviceStore.startTeleopSession(turtleBotId);
    } else {
      //If no devices in queue an API call should be made
      DeviceStore.setDevicesInQueue(1);
      console.log("refresh");
    }
  };

  const exitAction = () => {
    DeviceStore.exitSession();
    fadeIn(popup!);
  };

  return (
    <div className="overview__container fade-in">
      <Popup ISetSessionState={sessionResolution} visible={isPopupOpen} />
      <Devices quantity={devicesInQueue} />
      {isSessionInProgress && (
        <iframe
          id="sessionWindow"
          className="session__frame"
          src={teleopUrl!}
        />
      )}
      <SessionStarter
        devicesAvailable={!!devicesInQueue}
        action={sessionAction}
      />

      <ExitBar action={exitAction} />
    </div>
  );
});

export default Overview;
