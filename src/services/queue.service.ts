import { config } from "../config";
import { intervention } from "../types/interventions";

type result = "success" | "unsuccessful";

export class QueueService {
  getQueue = async (): Promise<string | intervention[]> => {
    const response = await fetch(config.INTERVENTION_API, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    });
    const parsedResponse = await response.json();

    if (parsedResponse.message !== undefined) {
      return parsedResponse.message;
    }

    return parsedResponse.items;
  };

  completeIntervention = async (_: result) => {
    const response = await fetch(config.INTERVENTION_API, {
      method: "POST",
      body: JSON.stringify({
        interventionId: "518e24fc-64ef-47bb-be5e-036a97aeafaa",
        interventionType: "teleop",
        data: {
          state: _,
          notes: "looks good!",
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("authToken"),
      },
    });
    const parsedResponse = await response.json();

    return parsedResponse;
  };
}
