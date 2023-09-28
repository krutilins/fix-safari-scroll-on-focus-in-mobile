export declare global {
  interface Array<T> {
    findLastIndex(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): number;
    findLast(
      predicate: (value: T, index: number, obj: T[]) => unknown,
      thisArg?: any
    ): T | undefined;
  }

  /* old firefox api */
  class DocumentTouch {
    static createTouch(
      view: Window,
      target: EventTarget,
      identifier: number,
      pageX: number,
      pageY: number,
      screenX: number,
      screenY: number
    ): Touch;
    createTouchList: (...touches: Touch[]) => TouchList;
  }

  /* old firefox api */
  interface Document extends DocumentTouch, Document {}

  interface Window {
    /* old firefox api */
    DocumentTouch: DocumentTouch;
  }

  interface EventListenerOptions {
    capture?: boolean;
    passive?: boolean;
  }
}
