from create_intervention_request import InterventionClient

if __name__ == "__main__":
    client = InterventionClient()
    client.run()
    client.remove_self_from_queue()
