from formant.sdk.agent.v1 import Client as AgentClient
from formant.sdk.cloud.v1 import Client as CloudClient
import os


class InterventionClient:
    def __init__(
        self,
    ):
        agent_url = "unix:///var/lib/formant/agent.sock"
        self.agent_url = os.getenv(agent_url)
        self._cloud_client = CloudClient()
        self._agent_client = AgentClient(
            agent_url=self.agent_url, ignore_throttled=True
        )
        self.internvention_id = ""  # type: str

    def create_intervention_request(self):
        intervention_response = self._agent_client.create_teleop_intervention_request(
            "Assist Client"
        )
        self.internvention_id = intervention_response.id

    def remove_self_from_queue(self):
        params = {
            "interventionId": self.internvention_id,
            "interventionType": "teleop",
            "data": {"state": "failure", "notes": "removed from queue"},
        }
        self._cloud_client.create_intervention_response(params)
