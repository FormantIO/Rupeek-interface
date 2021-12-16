import { action, makeObservable, observable } from "mobx";
import axios from "axios";
import config from "./config";
import { defined } from "./define";
import { urlSafeEncode } from "./urlSafeEncode";

export class QueueStore {
  devicesInQueue: number = 1;
  deviceId: string | null = null;
  isSessionInProgress: boolean | null = false;
  accessToken: string = "";
  teleopUrl: string | null = null;

  constructor() {
    makeObservable(this, {
      devicesInQueue: observable,
      deviceId: observable,
      isSessionInProgress: observable,
      accessToken: observable,
      teleopUrl: observable,
      startTeleopSession: action,
      setDeviceId: action,
      setDevicesInQueue: action,
      closeSession: action,
    });
  }
  startTeleopSession(deviceId: string) {
    this.isSessionInProgress = true;

    if (this.accessToken) {
      this.teleopUrl = `${config.TELEOP__API}/${defined(
        deviceId
      )}?token=${urlSafeEncode(defined(this.accessToken))}`;
      return;
    }

    axios
      .post(`${config.REFRESH_TOKEN_API}`, {
        refreshToken: localStorage.getItem("refreshToken"),
        tokenExpirationSeconds: 604800, //3 Hours
      })
      .then((response) => {
        this.accessToken = response.data.authentication.accessToken;
        this.teleopUrl = `${config.TELEOP__API}/${defined(
          deviceId
        )}?token=${urlSafeEncode(defined(this.accessToken))}`;
      });
  }
  closeSession() {
    //Session can be terminated by operator, or due to timeout once session is close i should
    //make a reequest to the server with the id of the device and state for the task(completed/not completed)

    this.isSessionInProgress = false;
    this.teleopUrl = "";
  }

  setDevicesInQueue(quanitity: number) {
    //Should be a get request, and expects a response with the size of the list of devices that need help
    let newQ = quanitity;
  }
  setDeviceId(deviceId: string) {
    //should get a device id in order to start a session
    this.deviceId = "someId";
  }
}

export const DeviceStore = new QueueStore();
