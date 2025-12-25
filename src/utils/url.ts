function extractQueryParams(url: string): Record<string, string | null> {
  try {
    const urlObject = new URL(url);
    const params = urlObject.searchParams;

    const extractedParams: Record<string, string | null> = {};

    params.forEach((value, key) => {
      extractedParams[key] = value;
    });

    return extractedParams;
  } catch (error) {
    console.error("Invalid URL:", error);
    return {};
  }
}

export { extractQueryParams };
