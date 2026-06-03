export const validUrl = (string: string): boolean => {
  if (!string) return false;
  try {
    // Regex that catches standard web URLs
    const pattern = new RegExp(
      '^https?:\\/\\/' + // protocol (http or https)
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', // fragment locator
      'i'
    );
    return pattern.test(string);
  } catch {
    return false;
  }
};
