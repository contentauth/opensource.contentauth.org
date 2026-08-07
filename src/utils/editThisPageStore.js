// DocItem/Layout and the navbar edit link are siblings under <Layout>, so
// there's no shared React context to read editUrl from. DocItem/Layout
// publishes the current page's editUrl here; the navbar item subscribes.
let currentEditUrl;
const listeners = new Set();

export function setEditThisPageUrl(url) {
  currentEditUrl = url;
  listeners.forEach((listener) => listener());
}

export function getEditThisPageUrl() {
  return currentEditUrl;
}

export function subscribeEditThisPageUrl(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
