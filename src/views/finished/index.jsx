import React, { useState, useEffect } from "react"
import { Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Grid, Icon, makeStyles, SvgIcon, Typography } from "@material-ui/core"

import logo from "../../static/logo.png"
import final from "../../static/final.svg"
import FingersCrossedHandEmoji from "../../static/FingersCrossedHandEmoji.svg"
import { ThumbUp } from "@material-ui/icons"

function FinishedScreen() {
  const sty = styles()

  const [bgPosition, setBgPosition] = useState("-200px")

  useEffect(() => {
    setTimeout(() => {
      setBgPosition("0px")
    }, 2000)
  }, [])

  return (
    <div
      className={sty.root}
      style={{
        backgroundPositionX: bgPosition,
      }}>
      <Grid container className={sty.container}>
        <Grid item sm={6} className={sty.sec1} container>
          <img src={logo} height={40} style={{ padding: "12px 0 24px" }} />

          <div>
            <Typography variant="h3" color="primary" style={{ fontWeight: "bold" }}>
              Well Done{" "}
              <span>
                <ThumbUp style={{ width: 40, height: 40 }} />
              </span>
            </Typography>

            <Typography variant="h5">
              Let’s cross the
              <br />
              finger
              <img height="30px" style={{ marginBottom: -9 }} src={FingersCrossedHandEmoji} />
            </Typography>
            <Typography variant="body1" style={{ margin: "20px 0" }}>
              Now set back and prepare yourself for next rounds. We’re excited to have you with us.
            </Typography>
            <Button variant="contained" color="primary" style={{ padding: "8px 41px", textTransform: "none" }}>
              Visit Us
            </Button>
          </div>
        </Grid>

        <Grid item sm={6} className={sty.sec2} container justify="center" alignContent="center">
          {/* <div className={sty.background}> */}
          <img width="60%" className={sty.bgGame} src={final} />
          {/* </div> */}
        </Grid>
      </Grid>
    </div>
  )
}

export default FinishedScreen

const styles = makeStyles(theme => ({
  root: {
    background: 'url("' + require("../../static/bg-art.png").default + '") no-repeat',
    backgroundSize: "contain",
    transition: "background 5s ease-out",

    // "&::before": {
    //   zIndex: -1,
    //   content: '""',
    //   display: "block",
    //   height: 180,
    //   width: 200,
    //   position: "absolute",
    //   bottom: "16%",
    //   left: 0,
    //   backgroundColor: theme.palette.primary.main,
    // },
    // "&::after": {
    //   zIndex: -1,
    //   content: '""',
    //   display: "block",
    //   height: 180,
    //   width: 200,
    //   position: "absolute",
    //   bottom: "16%",
    //   right: 0,
    //   backgroundColor: theme.palette.primary.main,
    // },
  },
  container: { minHeight: "100vh", maxWidth: 1200, margin: "auto" },
  sec1: {
    padding: "5%",
  },
  sec2: {},
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#F1ECE4",
    height: "100%",
    width: 400,
    zIndex: 1,
  },
  bgGame: {
    // position: "absolute",
    // bottom: "10%",
    // left: 12,
  },
}))
