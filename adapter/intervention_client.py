from formant.sdk.agent.v1 import Client as FormantClient
from formant.sdk.cloud.v1 import Client as CloudClient
import os


class InterventionClient:
    def __init__(
        self,
    ):
        agent_url = "unix:///var/lib/formant/agent.sock"  # type: str
        self.agent_url = os.getenv("AGENT_URL", agent_url)
        self._fclient = FormantClient(agent_url=self.agent_url, ignore_throttled=True)
        self.internvention_id = ""

    def create_intervention_request(self):
        intervention_response = self._fclient.create_teleop_intervention_request(
            "Assist Client"
        )
        self.internvention_id = intervention_response.id

    def remove_self_from_queue(self):
        params = {
            "interventionId": self.internvention_id,
            "interventionType": "teleop",
            "data": {"state": "failure", "notes": "removed from queue"},
        }
        CloudClient.create_intervention_response(params)

    def run(self):
        self.create_intervention_request()
