import findAndSplice from "./array/findAndSplice";

// eslint-disable-next-line @typescript-eslint/ban-types
export type EventListenerListeners = Record<string, (args: any[] | any) => any>;

type ListenerObject<T> = {
  callback: T;
  options: boolean | AddEventListenerOptions;
};

export default class EventListenerBase<
  Listeners extends EventListenerListeners,
> {
  protected listeners: Partial<{
    [k in keyof Listeners]: Array<ListenerObject<Listeners[k]>>;
  }> = {};
  protected listenerResults: Partial<{
    [k in keyof Listeners]: Parameters<Listeners[k]>;
  }> = {};

  private reuseResults?: boolean;

  constructor(reuseResults?: boolean) {
    this._constructor(reuseResults);
  }

  public _constructor(reuseResults?: boolean): any {
    this.reuseResults = reuseResults;
    this.listeners = {};
    this.listenerResults = {};
  }

  public addEventListener<T extends keyof Listeners>(
    name: T,
    callback: Listeners[T],
    options?: boolean | AddEventListenerOptions,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (this.listeners[name] ??= []).push({ callback, options }); // ! add before because if you don't, you won't be able to delete it from callback

    if (this.listenerResults.hasOwnProperty(name)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      callback(...this.listenerResults[name]);

      if ((options as AddEventListenerOptions)?.once) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.listeners[name].pop();
        return;
      }
    }

    // e.add(this, name, {callback, once});
  }

  public addMultipleEventsListeners(obj: {
    [name in keyof Listeners]?: Listeners[name];
  }) {
    for (const i in obj) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.addEventListener(i, obj[i]);
    }
  }

  public removeEventListener<T extends keyof Listeners>(
    name: T,
    callback: Listeners[T],
  ) {
    if (this.listeners[name]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      findAndSplice(this.listeners[name], (l) => l.callback === callback);
    }
  }

  protected invokeListenerCallback<
    T extends keyof Listeners,
    L extends ListenerObject<any>,
  >(name: T, listener: L, ...args: Parameters<L["callback"]>) {
    let result: any, error: any;
    try {
      result = listener.callback(...args);
    } catch (err) {
      error = err;
      // console.error('listener callback error', err);
    }

    if ((listener.options as AddEventListenerOptions)?.once) {
      this.removeEventListener(name, listener.callback);
    }

    if (error) {
      throw error;
    }

    return result;
  }

  private _dispatchEvent<T extends keyof Listeners>(
    name: T,
    collectResults: boolean,
    ...args: Parameters<Listeners[T]>
  ) {
    if (this.reuseResults) {
      this.listenerResults[name] = args;
    }

    const arr: Array<ReturnType<Listeners[typeof name]>> =
      collectResults && ([] as any);

    const listeners = this.listeners[name];
    if (listeners) {
      const left = listeners.slice();
      left.forEach((listener) => {
        const index = listeners.findIndex(
          (l) => l.callback === listener.callback,
        );
        if (index === -1) {
          return;
        }

        const result = this.invokeListenerCallback(name, listener, ...args);
        if (arr) {
          arr.push(result);
        }
      });
    }

    return arr;
  }

  public dispatchResultableEvent<T extends keyof Listeners>(
    name: T,
    ...args: Parameters<Listeners[T]>
  ) {
    return this._dispatchEvent(name, true, ...args);
  }

  public dispatchEvent<
    L extends EventListenerListeners = Listeners,
    T extends keyof L = keyof L,
  >(name: T, ...args: Parameters<L[T]>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._dispatchEvent(name, false, ...args);
  }

  public cleanup() {
    this.listeners = {};
    this.listenerResults = {};
  }
}
