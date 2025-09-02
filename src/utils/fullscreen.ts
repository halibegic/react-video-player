type DocumentWithFullscreen = Document & {
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitFullscreenElement?: Element;
  msExitFullscreen?: () => void;
  mozCancelFullScreen?: () => void;
  webkitExitFullscreen?: () => void;
};

type DocumentElementWithFullscreen = HTMLElement & {
  msRequestFullscreen?: () => void;
  mozRequestFullScreen?: () => void;
  webkitRequestFullScreen?: () => void;
  webkitEnterFullScreen?: () => void;
};

function isActiveFullscreen(): boolean {
  const doc = document as DocumentWithFullscreen;

  return !!(
    doc.fullscreenElement ||
    doc.mozFullScreenElement ||
    doc.webkitFullscreenElement ||
    doc.msFullscreenElement
  );
}

function requestFullscreen(element: DocumentElementWithFullscreen): void {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  } else if (element.webkitEnterFullScreen) {
    element.webkitEnterFullScreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  }
}

function exitFullscreen(doc: DocumentWithFullscreen): void {
  if (doc.exitFullscreen) {
    doc.exitFullscreen();
  } else if (doc.msExitFullscreen) {
    doc.msExitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    doc.webkitExitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    doc.mozCancelFullScreen();
  }
}

function onFullscreenChange(
  element: HTMLElement,
  handleFullscreen: (event: Event) => unknown
): () => void {
  element.addEventListener("fullscreenchange", handleFullscreen);
  element.addEventListener("webkitfullscreenchange", handleFullscreen);
  element.addEventListener("mozfullscreenchange", handleFullscreen);
  element.addEventListener("MSFullscreenChange", handleFullscreen);

  return () => {
    element.removeEventListener("fullscreenchange", handleFullscreen);
    element.removeEventListener("webkitfullscreenchange", handleFullscreen);
    element.removeEventListener("mozfullscreenchange", handleFullscreen);
    element.removeEventListener("MSFullscreenChange", handleFullscreen);
  };
}

export {
  exitFullscreen,
  isActiveFullscreen,
  onFullscreenChange,
  requestFullscreen,
};
