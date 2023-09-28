import EventListenerBase from "./eventListenerBase";

export class OverlayCounter extends EventListenerBase<{
  change: (isActive: boolean) => void;
}> {
  public overlaysActive = 0;
  public hasDarkOverlays = 0;

  get isOverlayActive() {
    return this.overlaysActive > 0;
  }

  set isOverlayActive(value: boolean) {
    this.overlaysActive += value ? 1 : -1;
    this.dispatchEvent("change", this.isOverlayActive);
  }

  get isDarkOverlayActive() {
    return this.hasDarkOverlays > 0;
  }

  set isDarkOverlayActive(value: boolean) {
    this.hasDarkOverlays += value ? 1 : -1;
    this.isOverlayActive = value;
  }
}

const overlayCounter = new OverlayCounter();
export default overlayCounter;
