import { Grid, LinearProgress, Typography } from "@material-ui/core"
import React, { useState, useEffect } from "react"
import { useHistory } from "react-router"
import miniLogo from "../../static/mini-logo.svg"
function LoadingScreen() {
  const [finish, setFinish] = useState(false)
  const history = useHistory()
  useEffect(() => {
    setTimeout(() => {
      setFinish(true)
      setTimeout(() => {
        history.push("/start")
      }, 1500)
    }, 2000)
  }, [])

  
  return (
    <Grid container justify="center" alignItems="center" direction="column" style={{ minHeight: "100vh" }}>
      <img style={{ transform: finish ? "rotate(360deg)" : "rotate(177deg)", transition: "all 1s cubic-bezier(0.76, 0.4, 0.8, 0.48) 0s" }} src={miniLogo} width={100} />
      <Typography style={{ marginTop: 12, marginBottom: 27 }}>Initializing</Typography>
      <LinearProgress style={{ width: 220 }} />
    </Grid>
  )
}

export default LoadingScreen
