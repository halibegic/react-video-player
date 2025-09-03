function offset(element: HTMLElement) {
  const ret = element.getBoundingClientRect();

  if (
    element.offsetWidth / element.offsetHeight >
    element.clientWidth / element.clientHeight
  ) {
    return {
      left: ret.left * 100,
      right: ret.right * 100,
      top: ret.top * 100,
      bottom: ret.bottom * 100,
      width: ret.width * 100,
      height: ret.height * 100,
    };
  }

  return ret;
}

function width(element: HTMLElement) {
  const ret = offset(element).width;
  return typeof ret === "undefined" ? element.offsetWidth : ret;
}

function height(element: HTMLElement) {
  const ret = offset(element).height;
  return typeof ret === "undefined" ? element.offsetHeight : ret;
}

export { height, offset, width };
