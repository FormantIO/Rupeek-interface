import { FC, useEffect } from "react";
import "./App.scss";
import Overview from "./components/Overview/Overview";
import { Authentication } from "@formant/data-sdk";

const App: FC = () => {
  useEffect(() => {
    saveToken();
  }, []);

  const saveToken = async () => {
    if (await Authentication.waitTilAuthenticated()) {
      console.log(Authentication.token);
      localStorage.setItem("authToken", Authentication.token!);
      localStorage.setItem(
        "organizationId",
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
