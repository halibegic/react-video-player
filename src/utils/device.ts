function is(regex: RegExp): boolean {
  const ua =
    typeof window !== "undefined" ? window.navigator?.userAgent || "" : "";
  return regex.test(ua);
}

const isiOS = is(/iPhone|iPad|iPod/i);

export { isiOS };
