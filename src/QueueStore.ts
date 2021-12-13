import { action, makeObservable, observable } from "mobx";
import axios from "axios";
import config from "./config";

export class QueueStore {
  devicesInQueue: number = 0;
  deviceId: string | null = null;
  isSessionInProgress: boolean | null = false;
  accessToken: string | null = null;
  teleopUrl: string | null = null;

  constructor() {
    makeObservable(this, {
      devicesInQueue: observable,
      deviceId: observable,
      isSessionInProgress: observable,
      accessToken: observable,
      teleopUrl: observable,
      startSession: action,
      setDeviceId: action,
      setDevicesInQueue: action,
      closeSession: action,
    });
  }
  generateAccessToken() {
    axios
      .post(`${config.REFRESH_TOKEN_API}`, {
        refreshToken: localStorage.getItem("refreshToken"),
        tokenExpirationSeconds: 10800, //3 Hours
      })
      .then(
        (response) =>
          (this.accessToken = response.data.authentication.accessToken)
      );
  }
  closeSession() {
    //Session can be terminated by operator, or due to timeout once session is close i should
    //make a reequest to the server with the id of the device and state for the task(completed/not completed)

    this.isSessionInProgress = false;
  }
  startSession(deviceId: string) {
    //Should make a get request to get id and generate url

    this.isSessionInProgress = true;

    if (!this.accessToken) this.generateAccessToken();
    this.teleopUrl = `${config.TELEOP__API}/${deviceId}?token=${this.accessToken}`;

    //get request if fullfill stay in session if rejected close window
  }
  setDevicesInQueue(quanitity: number) {
    //Should be a get request, and expects a response with the size of the list of devices that need help
    let newQ = quanitity;
    // setInterval(() => {
    //   console.log("hi");
    //   this.startSession();
    //   this.devicesInQueue = Math.floor(Math.random() * 100);
    // }, 5000);
  }
  setDeviceId(deviceId: string) {
    //should get a device id in order to start a session
    this.deviceId = "someId";
  }
}

export const DeviceStore = new QueueStore();
