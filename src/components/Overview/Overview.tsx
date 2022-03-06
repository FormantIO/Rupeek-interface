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
import { ErrorMsg } from "../ErrorMsg/ErrorMsg";
import { localStorageService } from "../../services/localStorageService";

const Overview: FC = observer(() => {
  const { queueStore } = useContext(StoreContext);

  const popup = document.getElementById("popup");

  useEffect(() => {
    queueStore.fetchDevicesQueue();
  }, [localStorageService.getIsSessionInProgress()]);

  const sessionResolution = (_: sessionResult) => {
    if (_ === sessionResult.successful || _ === sessionResult.unsuccesful) {
      fadeOut(popup!);
      queueStore.completeIntervention(_);
    } else if (_ === sessionResult.notDoneYet) fadeOut(popup!);
  };

  const sessionAction = () => {
    if (queueStore.devicesInQueue > 0) {
      queueStore.startTeleopSession();
    } else {
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

  const cleanError = () => {
    queueStore.setError("");
  };

  return (
    <div className="overview__container fade-in">
      <Popup
        ISetSessionState={sessionResolution}
        visible={queueStore.isPopupOpen}
      />
      <Devices quantity={queueStore.devicesInQueue} />

      {localStorageService.getIsSessionInProgress() === "true" && (
        <iframe
          id="sessionWindow"
          className="session__frame"
          src={localStorageService.getTeleopURL()!}
        />
      )}

      <SessionStarter
        devicesAvailable={!!queueStore.devicesInQueue}
        action={sessionAction}
        isLoading={queueStore.isLoading}
      />

      {localStorageService.getIsSessionInProgress() === "true" && (
        <ExitBar action={exitAction} />
      )}
      <Snackbar onclose={hideSnackBar} visible={queueStore.snackbar} />
      {queueStore.error.length > 0 && (
        <ErrorMsg msg={queueStore.error} onClose={cleanError} />
      )}
    </div>
  );
});

export default Overview;
