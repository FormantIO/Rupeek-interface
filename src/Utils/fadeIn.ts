export const fadeIn = (element: HTMLElement): void => {
  element.classList.remove("fade-out");
  element.classList.add("fade-in");
};
