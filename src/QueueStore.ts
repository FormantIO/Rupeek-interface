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
  latestQueue: intervention[] = [];

  constructor(private readonly queueService: QueueService) {
    makeAutoObservable(this);
    this.devicesInQueue = 0;
    this.isLoading = true;
    this.latestQueue = [];
  }

  pingAPI = async (id: string, notes: string) => {
    await this.queueService.updateIntervention(
      id,
      "inProgress",
      "Session started"
    );
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
        this.setLatestQueue(availableSessions);
        this.setIsLoading(false);
        if (localStorageService.getIsSessionInProgress() === "true") {
          this.setIsLoading(true);
        }
      }
    } catch (error) {
      this.setError("Unable to update queue");
    }
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
    return _.filter(
      (_, idx) =>
        onlineSessions[idx] &&
        (_.responses.length === 0 ||
          getLatestUpdate(_.responses)?.data.notes !== "Session started")
    );
  };

  checkIfCurrentDeviceAvailable = async (_: string): Promise<boolean> => {
    try {
      const intervention: intervention | string =
        await this.queueService.getIntervention(_);
      if (typeof intervention === "string") {
        this.setIsLoading(false);
        return false;
      }
      const lastUpdate = getLatestUpdate(intervention.responses);
      if (
        lastUpdate?.data.notes === "Session started" ||
        lastUpdate?.data.state === "inProgress"
      )
        return false;

      return true;
    } catch {
      return false;
    }
  };

  setNextDevice = async (_: intervention[]) => {
    for (let i = 0; i < _.length; i++) {
      const isDeviceCurrentlyAvailable =
        await this.checkIfCurrentDeviceAvailable(_[i].id);
      if (isDeviceCurrentlyAvailable) {
        localStorageService.setIsSessionInProgress("true");
        await this.pingAPI(_[i].id, "Session started");
        localStorageService.setInterventionId(_[i].id);
        this.setDeviceId(this.latestQueue[i].deviceId);
        break;
      }
    }
  };
  startTeleopSession = async () => {
    this.setIsLoading(true);

    if (this.latestQueue.length === 0) {
      localStorageService.clearSession();
      this.setError("No devices available");
      this.setIsLoading(false);
      return;
    }

    await this.setNextDevice(this.latestQueue);

    if (
      this.deviceId === null ||
      !Authentication.token ||
      !localStorageService.getInterventionId()
    ) {
      localStorageService.clearSession();
      this.setError("No devices available");
      this.setIsLoading(false);
      return;
    }

    const isDeviceAvailable = await this.checkIfDeviceIsAvailable(
      this.deviceId
    );

    if (!isDeviceAvailable) {
      localStorageService.setIsSessionInProgress("false");
      this.setError("Target device already taken");
      this.setIsLoading(false);
      return;
    }

    this.pingAPI(localStorageService.getInterventionId()!, "Session connected");
    localStorageService.setTeleopURL(
      `${config.TELEOP__API}/${defined(this.deviceId)}?token=${
        Authentication.token
      }`
    );
    this.setIsLoading(false);
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
      this.fetchDevicesQueue();
    } catch (error) {
      this.setError("Error occurred");
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

  setLatestQueue = (_: intervention[]) => {
    this.latestQueue = _;
  };

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
