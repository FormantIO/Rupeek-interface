import { FC, useEffect } from "react";
import "./App.scss";
import Overview from "./components/Overview/Overview";
import { Authentication } from "@formant/data-sdk";
import { localStorageService } from "./services/localStorageService";

const App: FC = () => {
  useEffect(() => {
    saveToken();
  }, []);

  const saveToken = async () => {
    if (await Authentication.waitTilAuthenticated()) {
      console.log(Authentication.token);
      localStorageService.setOrganizationId(
        Authentication.currentUser?.organizationId!
      );
    }
  };

  return (
    <div className="App">
      <Overview />
    </div>
  );
};

export default App;
