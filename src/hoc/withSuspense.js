import React, { Suspense } from "react"
import LinearProgress from "@material-ui/core/LinearProgress"

const styles = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: 2,
  zIndex: 9999,
  backgroundColor: "rgb(255, 255, 255, 0.4)",
}

export default function withSuspense(BaseComponent) {
  function WithSuspense(props) {
    return (
      <Suspense fallback={<LinearProgress color="secondary" style={styles} />}>
        <BaseComponent {...props} />
      </Suspense>
    )
  }
  return WithSuspense
}
