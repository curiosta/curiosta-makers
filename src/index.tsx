import { render } from "preact";
import "./index.css";
import App from "./App";
import { APP_URL, LEGACY_DOMAIN } from "./config/brand";

// The app moved to mint.curiosta.com. CloudFront 301s page loads on the old host, but an installed PWA's service
// worker can still serve this bundle there, so move over here too (keeps path, query and #fragment).
if (window.location.hostname === LEGACY_DOMAIN) {
  window.location.replace(APP_URL + window.location.pathname + window.location.search + window.location.hash);
} else {
  render(<App />, document.getElementById("app"));
}
