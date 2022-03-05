import { makeAutoObservable } from "mobx";
import { QueueService } from "./services/queue.service";
import { config } from "./config";
import { defined } from "./define";
import { intervention, response } from "./types/interventions";
import { checkIfDeviceUnattended } from "./Utils/checkIfDeviceUnattended";
import { Authentication, Fleet } from "@formant/data-sdk";
import { getLatestUpdate } from "./Utils/getLastesUpdate";

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
  organizationId: string | undefined;
  interventionId: string | undefined;
  error: string = "";
  isLoading: boolean = true;

  constructor(private readonly queueService: QueueService) {
    makeAutoObservable(this);
    this.devicesInQueue = 0;
    this.isLoading = true;
  }

  pingAPI = (id: string) => {
    if (this.isSessionInProgress) {
      this.queueService.updateIntervention(id, "inProgress", "ping");
    }
  };

  fetchDevicesQueue = async () => {
    try {
      if (await Authentication.waitTilAuthenticated()) {
        const queue: intervention[] | string =
          await this.queueService.getQueue();
        if (typeof queue === "string") {
          this.setError(queue);
          return;
        }
        const openInterventionRequest =
          this.filterWithInOrganizationOpenRequests(queue);
        const availableSessions = await this.filterOnlineSessions(
          openInterventionRequest
        );
        this.setDevicesInQueue(availableSessions.length);
        this.setIsLoading(false);

        const nextDevice = this.getNextDevice(openInterventionRequest);
      }
    } catch (error) {
      this.setError("Something went wrong");
    }
  };

  checkIfSessionOnline = async (_: string) => {
    const currentDevice = await Fleet.getDevice(_);
    const session = await currentDevice.isInRealtimeSession();
    return !session;
  };

  filterOnlineSessions = async (_: intervention[]) => {
    const onlineSessions = await Promise.all(
      _.map((_) => this.checkIfSessionOnline(_.deviceId!))
    );
    return _.filter((_, idx) => onlineSessions[idx]);
  };

  getNextDevice = (_: intervention[]) => {
    return _.some(async (_) => {
      const currentDevice = await Fleet.getDevice(_.deviceId!);
      const isInRealtimeSession = await currentDevice.isInRealtimeSession();
      if (!isInRealtimeSession) {
        this.setDeviceId(_.deviceId);
        localStorage.setItem("interventionId", _.id);
        return _;
      }
    });
  };

  startTeleopSession = async () => {
    this.setIsLoading(true);
    this.setIsSessionInProgress(true);
    const token = () => localStorage.getItem("authToken");
    const interventionId = () => localStorage.getItem("interventionId");

    if (!this.deviceId || !Authentication.token || !interventionId()) {
      this.setIsSessionInProgress(false);
      this.setTeleopUrl(null);
      this.setError("unknown device");
      return;
    }

    this.pingAPI(interventionId()!);

    this.setTeleopUrl(
      `${config.TELEOP__API}/${defined(this.deviceId)}?token=${token()}`
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
      console.log(error);
    }
  };

  filterWithInOrganizationOpenRequests = (_: intervention[]) => {
    const organizationId = () => localStorage.getItem("organizationId");
    return _.filter((_) => {
      if (
        _.organizationId === organizationId() &&
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
    this.setIsPopUpOpen(false);
    this.setIsSessionInProgress(false);
    this.setTeleopUrl(null);
    localStorage.removeItem("interventionId");
  }

  exitSession() {
    this.isPopupOpen = true;
  }

  //SETTERS
  setOrganizationId = (_: string | undefined) => {
    this.organizationId = _;
  };
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
  setIsLoading = (_: boolean) => {
    this.isLoading = _;
  };
}
