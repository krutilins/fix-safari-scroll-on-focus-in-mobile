import { doubleRaf } from "../schedulers";

export default function fixSafariStickyInput(input: HTMLElement) {
  input.style.transform = "translateY(-99999px)";
  input.focus();

  doubleRaf().then(() => {
    input.style.transform = "";
  });
}
