export const checkIfDeviceUnattended = (lastUpdate: string, window: number) => {
  const minutesInMilliSeconds = window * 60000;
  const lastUpdateInMilliSeconds = new Date(lastUpdate).getTime();
  const currentDate = Date.now();

  return currentDate - lastUpdateInMilliSeconds > minutesInMilliSeconds
    ? true
    : false;
};
