export const isVisible = function (
  ele: HTMLElement,
  container: HTMLElement,
  isFlexReverseColumn = false,
) {
  const eleRect = ele.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const eleTop = eleRect.top;
  const eleBottom = eleRect.bottom;
  const containerTop = containerRect.top;
  const containerBottom = containerRect.bottom;
  const eleLeft = eleRect.left;
  const eleRight = eleRect.right;
  const containerLeft = containerRect.left;
  const containerRight = containerRect.right;

  if (isFlexReverseColumn) {
    return (
      eleTop >= containerTop &&
      eleBottom <= containerBottom &&
      eleLeft >= containerLeft &&
      eleRight <= containerRight
    );
  }

  return (
    eleTop >= containerTop &&
    eleBottom <= containerBottom &&
    eleLeft >= containerLeft &&
    eleRight <= containerRight
  );
};
