import { useEffect, FC, useContext } from "react";
import { StoreContext } from "../../store.context";
import "./Overview.scss";
import { Devices } from "../Devices/Devices";
import { observer } from "mobx-react";
import { Popup } from "../PopUp/Popup";
import { sessionResult } from "../../QueueStore";
import { fadeIn } from "../../Utils/fadeIn";
import { fadeOut } from "../../Utils/fadeOut";
import { SessionStarter } from "../SessionStarter/SessionStarter";
import { ExitBar } from "../ExitBar/ExitBar";
import { Snackbar } from "../Snackbar/Snackbar";
import loading from "../../../src/components/images/loading.png";

const Overview: FC = observer(() => {
  const { queueStore } = useContext(StoreContext);

  const closebtn = document.querySelector(".close__btn") as HTMLElement;
  const popup = document.getElementById("popup");

  useEffect(() => {
    if (closebtn) closebtn!.style.display = "none";
    if (queueStore.isSessionInProgress) {
      setTimeout(() => {
        closebtn!.style.display = "flex";
      }, 7000);
    }
    queueStore.fetchDevicesQueue();
  }, [queueStore.isSessionInProgress]);

  const sessionResolution = (_: sessionResult) => {
    if (_ === sessionResult.successful || _ === sessionResult.unsuccesful) {
      fadeOut(popup!);
      queueStore.completeIntervention(_);
    } else if (_ === sessionResult.notDoneYet) fadeOut(popup!);
  };

  const sessionAction = () => {
    if (queueStore.devicesInQueue > 0) {
      queueStore.startTeleopSession();
      // setTimeout(pingApi, 45000);
    } else {
      //If no devices in queue an API call should be made
      queueStore.fetchDevicesQueue();
    }
  };

  const exitAction = () => {
    queueStore.exitSession();
    fadeIn(popup!);
  };

  const hideSnackBar = () => {
    queueStore.hideSnackbar();
  };

  const pingApi = () => {
    console.log("start");
    const interventionInProgress = () => localStorage.getItem("interventionId");
    if (queueStore.isSessionInProgress === false) return;
    console.log("done");
    if (interventionInProgress() !== null)
      queueStore.pingAPI(interventionInProgress()!);
    setTimeout(pingApi, 45000);
  };

  return (
    <div className="overview__container fade-in">
      <Popup
        ISetSessionState={sessionResolution}
        visible={queueStore.isPopupOpen}
      />
      <Devices quantity={queueStore.devicesInQueue} />
      {queueStore.isSessionInProgress && (
        <iframe
          id="sessionWindow"
          className="session__frame"
          src={queueStore.teleopUrl!}
        />
      )}
      {queueStore.isLoading ? (
        <img src={loading} />
      ) : (
        <SessionStarter
          devicesAvailable={!!queueStore.devicesInQueue}
          action={sessionAction}
        />
      )}

      <ExitBar action={exitAction} />
      <Snackbar onclose={hideSnackBar} visible={queueStore.snackbar} />
    </div>
  );
});

export default Overview;
