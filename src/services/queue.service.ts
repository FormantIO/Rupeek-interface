import { config } from "../config";
import { intervention } from "../types/interventions";
import { Authentication } from "@formant/data-sdk";

export type interventionState =
  | "inProgress"
  | "requestAssistance"
  | "success"
  | "failure";

export class QueueService {
  getQueue = async (): Promise<string | intervention[]> => {
    const response = await fetch(config.INTERVENTION_REQUEST_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Authentication.token,
      },
    });
    const parsedResponse = await response.json();

    if (parsedResponse.message !== undefined) {
      return parsedResponse.message;
    }

    return parsedResponse.items;
  };
  getIntervention = async (_: string): Promise<string | intervention> => {
    const response = await fetch(`${config.INTERVENTION_REQUEST_API}/${_}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Authentication.token,
      },
    });
    const parsedResponse = await response.json();
    return parsedResponse;
  };

  updateIntervention = async (
    interventionId: string,
    state: interventionState,
    notes: string
  ) => {
    const response = await fetch(config.INTERVENTION_RESPONSE_API, {
      method: "POST",
      body: JSON.stringify({
        interventionId: interventionId,
        interventionType: "teleop",
        data: {
          state: state,
          notes: notes,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Authentication.token,
      },
    });
    const parsedResponse = await response.json();

    if (parsedResponse.message !== undefined) {
      return parsedResponse.message;
    }

    return parsedResponse;
  };

  completeIntervention = async (id: string, _: "success" | "failure") => {
    const response = await fetch(config.INTERVENTION_RESPONSE_API, {
      method: "POST",
      body: JSON.stringify({
        interventionId: id,
        interventionType: "teleop",
        data: {
          state: _,
          notes: "",
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + Authentication.token,
      },
    });
    const parsedResponse = await response.json();

    return parsedResponse;
  };
}
