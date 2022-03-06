export const localStorageService = {
  setIsSessionInProgress: (_: "true" | "false") => {
    localStorage.setItem("isSessionInProgress", _);
  },
  getIsSessionInProgress: () => {
    return localStorage.getItem("isSessionInProgress");
  },
  setOrganizationId: (_: string) => {
    localStorage.setItem("organizationId", _);
  },
  getOrganizationId: () => {
    return localStorage.getItem("organizationId");
  },
  setTeleopURL: (_: string) => {
    localStorage.setItem("teleopURL", _);
  },
  getTeleopURL: () => {
    return localStorage.getItem("teleopURL");
  },
  setInterventionId: (_: string) => {
    localStorage.setItem("interventionId", _);
  },
  getInterventionId: () => {
    return localStorage.getItem("interventionId");
  },
  clearSession: () => {
    localStorage.removeItem("teleopURL");
    localStorageService.setIsSessionInProgress("false");
    localStorage.removeItem("interventionId");
  },
};
