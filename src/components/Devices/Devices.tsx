import "./Devices.scss";
import { DeviceIcon } from "../../icons/DeviceIcon";
import { observer } from "mobx-react";

interface DevicesProps {
  quantity?: number;
}

export const Devices = observer((props: DevicesProps) => {
  return (
    <div className="devices__container">
      <DeviceIcon size={24} color="#bac4e2" />
      <div className="text__container">
        <p>Assist</p>
      </div>
      <div className="quantity__container">
        <p>{props.quantity}</p>
      </div>
    </div>
  );
});
