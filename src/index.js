import React from "react"
import { render } from "react-dom"
import { Provider } from "react-redux"
import "./index.css"
import store from "./redux/store"
// import reportWebVitals from "./reportWebVitals"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import Theme from "./theme/theme"
import RouterContainer from "./router/Router"

render(
  <React.StrictMode>
    <Provider store={store}>
      <Theme>
        <RouterContainer />
      </Theme>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
)

serviceWorkerRegistration.register({
  onUpdate: reg => forceUpdate(reg.waiting),
  onWaiting: waiting => forceUpdate(waiting),
})

// reportWebVitals(console.log);

function forceUpdate(serviceWorkerRegistration) {
  const registrationWaiting = serviceWorkerRegistration
  if (registrationWaiting) {
    registrationWaiting.postMessage({ type: "SKIP_WAITING" })
    registrationWaiting.addEventListener("statechange", e => {
      if (e.target.state === "activated") {
        window.location.reload()
      }
    })
  }
}
