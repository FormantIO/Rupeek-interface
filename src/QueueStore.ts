import { makeAutoObservable } from "mobx";
import { QueueService } from "./services/queue.service";
import { config } from "./config";
import { defined } from "./define";
import { intervention, queue } from "./types/interventions";

export enum sessionResult {
  successful,
  unsuccesful,
  notDoneYet,
}
export class QueueStore {
  devicesInQueue: number = 0;
  private deviceId: string | null = null;
  isSessionInProgress: boolean | null = false;
  teleopUrl: string | null = null;
  isPopupOpen: boolean = false;
  snackbar: boolean = false;
  error: string = "";

  constructor(private readonly queueService: QueueService) {
    makeAutoObservable(this);
    this.devicesInQueue = 0;
  }

  fetchDevicesQueue = async () => {
    try {
      const queue: intervention[] | string = await this.queueService.getQueue();
      if (typeof queue === "string") {
        this.setError(queue);
        return;
      }
      this.setDevicesInQueue(queue.length);
      if (queue.length > 0) {
        this.setDeviceId(queue[0].deviceId);
      }
    } catch (error) {
      this.setError("Something went wrong");
    }
  };
  startTeleopSession = async () => {
    this.setIsSessionInProgress(true);

    if (!!this.deviceId || !!localStorage.getItem("authToken")) {
      this.setIsSessionInProgress(false);
      this.setTeleopUrl(null);
      this.setError("unknown device");
      console.log(this.error);
      return;
    }
    this.setTeleopUrl(
      `${config.TELEOP__API}/${defined(
        this.deviceId
      )}?token=${localStorage.getItem("authToken")}`
    );
  };

  completeIntervention = async (_: sessionResult) => {
    try {
      const response = await this.queueService.completeIntervention(
        sessionResult.successful ? "success" : "unsuccessful"
      );
      this.clearSession();
      this.showSnackbar();
    } catch (error) {
      console.log(error);
    }
  };

  showSnackbar() {
    this.snackbar = true;
  }
  hideSnackbar() {
    this.snackbar = false;
  }

  clearSession() {
    this.setIsPopUpOpen(false);
    this.setIsSessionInProgress(false);
    this.setTeleopUrl(null);
  }

  exitSession() {
    this.isPopupOpen = true;
  }
  // requestTo = async () => {
  //   //Session can be terminated by operator, or due to timeout once session is close i should
  //   //make a reequest to the server with the id of the device and state for the task(completed/not completed)

  //   try {
  //     const response = await this.queueService.completeIntervention();
  //     this.setIsPopUpOpen(true);
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   this.isPopupOpen = true;
  // };

  //SETTERS
  setDevicesInQueue = (_: number) => {
    this.devicesInQueue = _;
  };
  setDeviceId = (_: string | null) => {
    this.deviceId = _;
  };
  setIsSessionInProgress = (_: boolean) => {
    this.isSessionInProgress = _;
  };
  setTeleopUrl = (_: string | null) => {
    this.teleopUrl = _;
  };
  setIsPopUpOpen = (_: boolean) => {
    this.isPopupOpen = _;
  };
  setSnackBar = (_: boolean) => {
    this.snackbar = _;
  };
  setError = (_: string) => {
    this.error = _;
  };
}
