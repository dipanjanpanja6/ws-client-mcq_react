import React, { useState, useEffect } from "react"
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core"
import { CellWifi, CheckCircleOutline, Info, Mic, VideoCall, Videocam } from "@material-ui/icons"
import logo from "../../static/logo.png"
import bgGame from "../../static/bg-game.svg"
import { socketio_address, height, width, framerate, audiobitrate } from "../../config"
import { useHistory } from "react-router"

function GetStarted() {
  const sty = styles()
  const history = useHistory()
  const [camera, setCamera] = useState(null)
  const [network, setNetwork] = useState(null)
  const [mic, setMic] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      requestMedia()
    }, 2000)
  }, [])

  const requestMedia = async () => {
    var constraints = {
      audio: {
        sampleRate: audiobitrate,
        echoCancellation: true,
      },
      video: {
        width: { min: 100, ideal: width, max: 1920 },
        height: { min: 100, ideal: height, max: 1080 },
        frameRate: { ideal: framerate },
      },
    }
    try {
      //   const stream = await navigator.mediaDevices.getDisplayMedia({
      //     video: { mediaSource: "screen" },
      //   })

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      let supported = navigator.mediaDevices.getSupportedConstraints()
      console.log(supported)
      const mediaRecorder = new MediaRecorder(stream)
      setCamera(true)
    } catch (err) {
      console.log("The following error occured: " + err)
      setCamera(false)
    }
  }
  const handleStart = () => {
    history.replace("/start")
  }

  return (
    <Grid container style={{ minHeight: "100vh", backgroundImage: 'url("' + require("../../static/bg-art.png").default + '")  no-repeat contain' }}>
      <Grid item sm={7} style={{ padding: "5%", position: "relative" }}>
        <div style={{ zIndex: 100, position: "inherit" }}>
          <Typography variant="h4">Welcome</Typography>
          <img src={logo} height={57} style={{ padding: "12px 0 24px" }} />
          <Typography color="textSecondary" style={{ fontWeight: "bold" }} variant="h3">
            Self Assessment
            <br /> Session
          </Typography>
        </div>
        <div className={sty.background}>
          <img width="90%" className={sty.bgGame} src={bgGame} />
        </div>
      </Grid>

      <Grid item sm={5} container justify="center" alignContent="center">
        <Card style={{ maxWidth: 430, padding: 12, borderRadius: 14 }}>
          <CardHeader title={<Typography variant="h6">Make Sure</Typography>} subheader={<Typography>Check all required devices are connected and working properly.</Typography>} />
          <CardContent style={{ paddingTop: 40, paddingBottom: 40 }}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CellWifi color="primary" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ variant: "body2" }} primary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mi fermentum id euismod sit." />
                <ListItemSecondaryAction>
                  {network === true ? <CheckCircleOutline color="secondary" /> : network === false ? <Info color="error" /> : <CircularProgress size={20} color="secondary" />}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Videocam color="primary" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ variant: "body2" }} primary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mi fermentum id euismod sit." />
                <ListItemSecondaryAction>
                  {camera === true ? <CheckCircleOutline color="secondary" /> : camera === false ? <Info color="error" /> : <CircularProgress size={20} color="secondary" />}
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Mic color="primary" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ variant: "body2" }} primary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mi fermentum id euismod sit." />
                <ListItemSecondaryAction>
                  {mic === true ? <CheckCircleOutline color="secondary" /> : mic === false ? <Info color="error" /> : <CircularProgress size={20} color="secondary" />}
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </CardContent>
          <CardActions>
            <Button onClick={handleStart} disabled={!camera || !mic || !network} style={{ marginLeft: "auto" }} color="primary" size="large" startIcon={<VideoCall />} variant="outlined">
              get stared
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  )
}

export default GetStarted

const styles = makeStyles(() => ({
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
    position: "absolute",
    bottom: "10%",
    left: 12,
  },
}))
