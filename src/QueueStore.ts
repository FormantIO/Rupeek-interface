import { action, makeObservable, observable } from "mobx";
import { Authentication } from "@formant/data-sdk";
import axios from "axios";
import config from "./config";
import { defined } from "./define";
import { urlSafeEncode } from "./urlSafeEncode";

export enum sessionResult {
  successful,
  unsuccesful,
  notCompleted,
}

export class QueueStore {
  devicesInQueue: number = Math.floor(Math.random() * 10);
  deviceId: string | null = null;
  isSessionInProgress: boolean | null = false;
  teleopUrl: string | null = null;
  IWantToExit: boolean = false;

  constructor() {
    makeObservable(this, {
      devicesInQueue: observable,
      deviceId: observable,
      isSessionInProgress: observable,
      teleopUrl: observable,
      IWantToExit: observable,
      startTeleopSession: action,
      setDevicesInQueue: action,
      completeSession: action,
      closePopup: action,
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
    console.log(this.teleopUrl);
  };

  closePopup(_: sessionResult) {
    switch (_) {
      case sessionResult.successful: {
        //Make API request to set success in session
        console.log("success");
        this.IWantToExit = false;
        this.isSessionInProgress = false;
        this.teleopUrl = null;
        break;
      }
      case sessionResult.unsuccesful: {
        console.log("put back in queue");
        this.IWantToExit = false;
        this.isSessionInProgress = false;
        this.teleopUrl = null;
        break;
      }
      case sessionResult.notCompleted: {
        console.log("not yet");
        this.IWantToExit = false;
        break;
      }
      default: {
        this.IWantToExit = false;
        break;
      }
    }
  }

  completeSession() {
    //Session can be terminated by operator, or due to timeout once session is close i should
    //make a reequest to the server with the id of the device and state for the task(completed/not completed)
    console.log(this);
    this.IWantToExit = true;
    // this.setDevicesInQueue(this.devicesInQueue - 1);
    // this.teleopUrl = "";
  }

  setDevicesInQueue(quanitity: number) {
    //Should be a get request, and expects a response with the size of the list of devices that need help
    this.devicesInQueue = quanitity;
  }
}

export const DeviceStore = new QueueStore();
