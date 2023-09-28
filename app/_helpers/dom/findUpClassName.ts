export default function findUpClassName(
  el: EventTarget | { closest: (selector: string) => any },
  className: string,
): HTMLElement {
  return (el as any).closest("." + className);
}
