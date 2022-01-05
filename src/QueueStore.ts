import { action, makeObservable, observable } from "mobx";
import { Authentication } from "@formant/data-sdk";
import axios from "axios";
import config from "./config";
import { defined } from "./define";
import { urlSafeEncode } from "./urlSafeEncode";

export class QueueStore {
  devicesInQueue: number = Math.floor(Math.random() * 10);
  deviceId: string | null = null;
  isSessionInProgress: boolean | null = false;
  teleopUrl: string | null = null;

  constructor() {
    makeObservable(this, {
      devicesInQueue: observable,
      deviceId: observable,
      isSessionInProgress: observable,
      teleopUrl: observable,
      startTeleopSession: action,
      setDevicesInQueue: action,
      closeSession: action,
    });
  }
  startTeleopSession = async (deviceId: string) => {
    this.isSessionInProgress = true;
    if (!Authentication.token) {
      this.isSessionInProgress = false;
      this.teleopUrl = null;
    }
    this.teleopUrl = `${config.TELEOP__API}/${defined(
      deviceId
    )}?token=${urlSafeEncode(defined(Authentication.token))}`;
    console.log(this.teleopUrl);
  };
  closeSession() {
    //Session can be terminated by operator, or due to timeout once session is close i should
    //make a reequest to the server with the id of the device and state for the task(completed/not completed)

    this.isSessionInProgress = false;
    this.setDevicesInQueue(this.devicesInQueue - 1);
    this.teleopUrl = "";
  }

  setDevicesInQueue(quanitity: number) {
    //Should be a get request, and expects a response with the size of the list of devices that need help
    this.devicesInQueue = quanitity;
  }
}

export const DeviceStore = new QueueStore();
