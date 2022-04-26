from formant.sdk.agent.v1 import Client as FormantClient
import os


class InterventionClient:
    def __init__(
        self,
    ):
        self.agent_url = os.getenv("AGENT_URL", "unix: // /var/lib/formant/agent.sock")
        self._fclient = FormantClient(agent_url=self.agent_url, ignore_throttled=True)
        self.internvention_id = ""

    def create_intervention_request(self):
        intervention_response = self._fclient.create_teleop_intervention_request(
            "Assist Client"
        )
        self.internvention_id = intervention_response.id

    def run(self):
        self.create_intervention_request()
