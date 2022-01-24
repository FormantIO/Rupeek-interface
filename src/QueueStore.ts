import { action, makeObservable, observable } from "mobx";
import { Authentication } from "@formant/data-sdk";
import axios from "axios";
import config from "./config";
import { defined } from "./define";
import { urlSafeEncode } from "./urlSafeEncode";

export enum sessionResult {
  successful,
  unsuccesful,
  notDoneYet,
}

export class QueueStore {
  devicesInQueue: number = Math.floor(Math.random() * 10);
  deviceId: string | null = null;
  isSessionInProgress: boolean | null = false;
  teleopUrl: string | null = null;
  isPopupOpen: boolean = false;

  constructor() {
    makeObservable(this, {
      devicesInQueue: observable,
      deviceId: observable,
      isSessionInProgress: observable,
      teleopUrl: observable,
      isPopupOpen: observable,
      startTeleopSession: action,
      setDevicesInQueue: action,
      completeSession: action,
      setSessionState: action,
      exitSession: action,
      clearSession: action,
    });
  }
  startTeleopSession = async (deviceId: string) => {
    this.isSessionInProgress = true;
    await Authentication.waitTilAuthenticated();

    if (!Authentication.token) {
      this.isSessionInProgress = false;
      this.teleopUrl = null;
    }
    this.teleopUrl = `${config.TELEOP__API}/${defined(deviceId)}?token=${
      Authentication.token
    }`;
  };

  setSessionState(_: sessionResult) {
    if (sessionResult.successful) {
      //Make API request to set success in session
      console.log("success");
      this.clearSession();
    } else if (sessionResult.unsuccesful) {
      //Make API request to put device at the top of the queue
      console.log("put back in queue");
      this.clearSession();
    }
  }

  clearSession() {
    this.isPopupOpen = false;
    this.isSessionInProgress = false;
    this.teleopUrl = null;
  }

  exitSession() {
    this.isPopupOpen = true;
  }
  completeSession() {
    //Session can be terminated by operator, or due to timeout once session is close i should
    //make a reequest to the server with the id of the device and state for the task(completed/not completed)

    this.isPopupOpen = true;
    // this.setDevicesInQueue(this.devicesInQueue - 1);
    // this.teleopUrl = "";
  }

  setDevicesInQueue(quanitity: number) {
    //Should be a get request, and expects a response with the size of the list of devices that need help
    this.devicesInQueue = quanitity;
  }
}

export const DeviceStore = new QueueStore();
