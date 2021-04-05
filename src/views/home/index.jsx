import { CssBaseline, Grid, IconButton, makeStyles, Paper, Typography } from "@material-ui/core"
import { FiberManualRecordRounded, GraphicEqRounded, Info, MoreVert } from "@material-ui/icons"
import React, { useEffect, useRef } from "react"
import logo from "../../static/logo.png"
import VerticalLinearStepper from "./component"

function HomeScreen() {
  const output_video = useRef()
  const sty = styles()

  useEffect(() => {
    return () => { }
  }, [])

  return (
    <Grid container>
      <CssBaseline />
      <Grid
        item
        sm={8}
        style={{ padding: "20px 20px 20px 30px", background: "#F1ECE4", position: "sticky", top: 0, left: 0, bottom: 0, height: "100vh" }}
        container
        direction="column"
        justify="space-between"
        alignContent="center">
        <img src={logo} width={100} /*style={{ padding: "12px 0 24px" }}*/ />

        <Paper elevation={3} className={sty.videoContainer}>
          <Grid container className={sty.action} style={{ top: 0 }} alignItems="center" justify="space-between">
            <div style={{ display: "flex" }}>
              <FiberManualRecordRounded color="error" />
              <Typography>RECORDING</Typography>
            </div>
            <IconButton color="inherit">
              <MoreVert />
            </IconButton>
          </Grid>
          <video id="output_video" ref={output_video} autoplay={true} className={sty.video} />
          <Grid container className={sty.action} style={{ bottom: 0 }} alignItems="center">
            <div style={{ display: "flex" }}>
              <GraphicEqRounded color="inherit" />
              <Typography variant="caption">00:05</Typography>
            </div>
          </Grid>
        </Paper>

        <div style={{ display: "flex", alignItems: "center", paddingBottom: 12 }}>
          <Info />
          <Typography variant="caption" style={{ paddingLeft: 12 }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Luctus enim amet ut pulvinar id risus. Donec volutpat, consectetur elementum sed.
          </Typography>
        </div>
      </Grid>
      <Grid item sm={4} className={sty.sec2}>
        <VerticalLinearStepper />
      </Grid>
    </Grid>
  )
}

export default HomeScreen
const styles = makeStyles(theme => ({
  sec2: {
    background: 'url("' + require("../../static/bg-art.png").default + '") no-repeat',
    position: "relative",
    height: "inherit",
  },
  video: { width: "100%", height: "100%", background: "#000", borderRadius: 14 },
  videoContainer: {
    maxWidth: "90%",
    width: 1024,
    height: 480,
    margin: "auto",
    borderRadius: 14,
    position: "relative",
    color: "#fff",
  },
  action: {
    position: "absolute",
    left: 0,
    right: 0,
    padding: 12,
  },
}))
