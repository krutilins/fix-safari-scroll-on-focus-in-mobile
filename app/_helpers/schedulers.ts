import { NoneToVoidFunction } from "../types";

let fastRafCallbacks: NoneToVoidFunction[] | undefined;
export function fastRaf(callback: NoneToVoidFunction) {
  if (!fastRafCallbacks) {
    fastRafCallbacks = [callback];

    requestAnimationFrame(() => {
      const currentCallbacks = fastRafCallbacks as NoneToVoidFunction[];
      fastRafCallbacks = undefined;
      currentCallbacks.forEach((cb) => cb());
    });
  } else {
    fastRafCallbacks.push(callback);
  }
}

let fastRafConventionalCallbacks: NoneToVoidFunction[] | undefined,
  processing = false;
export function fastRafConventional(callback: NoneToVoidFunction) {
  if (!fastRafConventionalCallbacks) {
    fastRafConventionalCallbacks = [callback];

    requestAnimationFrame(() => {
      processing = true;
      for (
        let i = 0;
        i < (fastRafConventionalCallbacks as NoneToVoidFunction[]).length;
        ++i
      ) {
        (fastRafConventionalCallbacks as NoneToVoidFunction[])[i]();
      }

      fastRafConventionalCallbacks = undefined;
      processing = false;
    });
  } else if (processing) {
    callback();
  } else {
    fastRafConventionalCallbacks.push(callback);
  }
}

let rafPromise: Promise<void> | undefined;
export function fastRafPromise() {
  if (rafPromise) return rafPromise;

  rafPromise = new Promise<void>((resolve) => fastRaf(() => resolve()));
  rafPromise.then(() => {
    rafPromise = undefined;
  });

  return rafPromise;
}

export function doubleRaf() {
  return new Promise<void>((resolve) => {
    fastRaf(() => {
      fastRaf(resolve);
    });
  });
}
