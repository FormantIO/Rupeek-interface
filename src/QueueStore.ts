import { makeAutoObservable } from "mobx";
import { QueueService } from "./services/queue.service";
import { config } from "./config";
import { defined } from "./define";
import { intervention, response } from "./types/interventions";
import { Authentication, Fleet } from "@formant/data-sdk";
import { getLatestUpdate } from "./Utils/getLastesUpdate";
import { localStorageService } from "./services/localStorageService";

export enum sessionResult {
  successful,
  unsuccesful,
  notDoneYet,
}
export class QueueStore {
  devicesInQueue: number = 0;
  private deviceId: string | null = null;
  isPopupOpen: boolean = false;
  snackbar: boolean = false;
  interventionId: string | undefined;
  error: string = "";
  isLoading: boolean = true;

  constructor(private readonly queueService: QueueService) {
    makeAutoObservable(this);
    this.devicesInQueue = 0;
    this.isLoading = true;
  }

  pingAPI = (id: string) => {
    this.queueService.updateIntervention(id, "inProgress", "Session started");
  };

  fetchDevicesQueue = async () => {
    this.setIsLoading(true);
    try {
      if (await Authentication.waitTilAuthenticated()) {
        const queue: intervention[] | string =
          await this.queueService.getQueue();
        if (typeof queue === "string") {
          this.setError(queue);
          this.setIsLoading(false);
          return;
        }
        const openInterventionRequest =
          this.filterWithInOrganizationOpenRequests(queue);
        const availableSessions = await this.filterOnlineSessions(
          openInterventionRequest
        );
        this.setDevicesInQueue(availableSessions.length);
        this.getNextDevice(availableSessions);
        this.setIsLoading(false);
        if (localStorageService.getIsSessionInProgress() === "true") {
          this.setIsLoading(true);
        }
      }
    } catch (error) {
      this.setError("Something went wrong");
    }
  };

  getNextDevice = (_: intervention[]) => {
    this.setDeviceId(_[0].deviceId);
    localStorageService.setInterventionId(_[0].id);
  };
  checkIfDeviceIsAvailable = async (_: string) => {
    const currentDevice = await Fleet.getDevice(_);
    const session = await currentDevice.isInRealtimeSession();
    return !session;
  };

  filterOnlineSessions = async (_: intervention[]) => {
    const onlineSessions = await Promise.all(
      _.map((_) => this.checkIfDeviceIsAvailable(_.deviceId!))
    );
    return _.filter((_, idx) => onlineSessions[idx]);
  };

  startTeleopSession = async () => {
    localStorageService.setIsSessionInProgress("true");
    this.setIsLoading(true);
    if (
      !this.deviceId ||
      !Authentication.token ||
      !localStorageService.getInterventionId()
    ) {
      localStorageService.setIsSessionInProgress("false");
      this.setError("unknown device");
      this.setIsLoading(false);
      return;
    }
    const isDeviceAvailable = await this.checkIfDeviceIsAvailable(
      this.deviceId
    );

    if (!isDeviceAvailable) {
      localStorageService.setIsSessionInProgress("false");
      this.setError("Target device was taken");
      this.setIsLoading(false);

      return;
    }
    this.pingAPI(localStorageService.getInterventionId()!);
    localStorageService.setTeleopURL(
      `${config.TELEOP__API}/${defined(this.deviceId)}?token=${
        Authentication.token
      }`
    );
  };

  completeIntervention = async (_: sessionResult) => {
    const interventionId = () => localStorage.getItem("interventionId");
    try {
      const response = await this.queueService.completeIntervention(
        interventionId()!,
        _ === sessionResult.successful ? "success" : "failure"
      );
      this.clearSession();
      this.showSnackbar();
    } catch (error) {
      this.setError("Something went wrong!");
    }
  };

  filterWithInOrganizationOpenRequests = (_: intervention[]) => {
    return _.filter((_) => {
      if (
        _.organizationId === localStorageService.getOrganizationId() &&
        _.interventionType === "teleop" &&
        _.deviceId !== null
      ) {
        if (_.responses.length === 0) return _;
        let latestUpdate = getLatestUpdate(_.responses);
        if (
          latestUpdate!.data.state === "success" ||
          latestUpdate!.data.state === "failure"
        )
          return;
        return _;
      }
    });
  };

  showSnackbar() {
    this.snackbar = true;
  }
  hideSnackbar() {
    this.snackbar = false;
  }

  clearSession() {
    localStorageService.clearSession();
    this.setIsPopUpOpen(false);
  }

  exitSession() {
    this.isPopupOpen = true;
  }

  //SETTERS

  setDevicesInQueue = (_: number) => {
    this.devicesInQueue = _;
  };
  setDeviceId = (_: string | null) => {
    this.deviceId = _;
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
  setIsLoading = (_: boolean) => {
    this.isLoading = _;
  };
}
