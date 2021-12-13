import { FC } from "react";
import "./App.scss";
import Overview from "./components/Overview/Overview";
import { Route, Routes } from "react-router";
import { DeviceStore } from "./QueueStore";

const App: FC = () => {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Overview DeviceStore={DeviceStore} />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
