import React, { useState, useEffect, useRef } from "react"
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
  CssBaseline,
  IconButton,
  Paper,
} from "@material-ui/core"
import { CellWifi, CheckCircleOutline, Info, Mic, VideoCall, Videocam, FiberManualRecordRounded, GraphicEqRounded, MoreVert } from "@material-ui/icons"
import { io } from "socket.io-client"
import logo from "../../static/logo.png"
import bgGame from "../../static/bg-game.svg"
import { socketio_address, height, width, framerate, audiobitrate } from "../../config"
import { useHistory } from "react-router"
import { fail } from "../../utils/utils"
import VerticalLinearStepper from "../home/component"
import { validate_api } from "../../apis/validate"
import LoadingScreen from "../loading"

var stream

function GetStarted() {
  const sty = styles()
  const history = useHistory()
  const [start, setStart] = useState(false)
  const [camera, setCamera] = useState(null)
  const [network, setNetwork] = useState(null)
  const [mic, setMic] = useState(null)
  const [bgPosition, setBgPosition] = useState("-200px")
  const [state, set_state] = useState({ option_url: "rtmp://192.168.0.98/live/key" })

  const [reconnect, set_reconnect] = useState(true)
  var output_video = useRef()
  var mediaRecorder = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      requestMedia()
      validateSession()
      // connect_server()
      setBgPosition("0px")
    }, 2000)

    window.onblur = function () {
      console.log("Focus Out!")
    }
    document.onmouseleave = function () {
      console.log("Mouse Out!")
    }
    navigator.keyboard.lock();
  }, [])

  useEffect(() => {
    let x = true
    if (output_video.current && x) {
      console.log(output_video.current)
      video_show(stream)
      x = false
    }
  }, [start, output_video])



  const handleStart = () => {
    // history.replace("/start")
    setStart('loading')
  }



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

      let supported = navigator.mediaDevices.getSupportedConstraints()
      console.log(supported)
      stream = await navigator.mediaDevices.getUserMedia(constraints)
      mediaRecorder.current = new MediaRecorder(stream)

      setCamera(true)
    } catch (err) {
      //log to console first
      console.log(err) /* handle the error */
      if (err.name == "NotFoundError" || err.name == "DevicesNotFoundError") {
        //required track is missing
      } else if (err.name == "NotReadableError" || err.name == "TrackStartError") {
        //webcam or mic are already in use
      } else if (err.name == "OverconstrainedError" || err.name == "ConstraintNotSatisfiedError") {
        //constraints can not be satisfied by avb. devices
      } else if (err.name == "NotAllowedError" || err.name == "PermissionDeniedError") {
        //permission denied in browser
      } else if (err.name == "TypeError" || err.name == "TypeError") {
        //empty constraints object
      } else {
        //other errors
      }
      console.log("The following error occurred: ", { err })
      setCamera(false)
    }
  }
  const validateSession = async () => {
    try {
      const { data } = await validate_api({ uid: 'xxx', exam_code: 'xxx', src: 'web' })
      if (data.success) {
        setNetwork(true)
      } else {
        setNetwork(false)
      }
    } catch (error) {
      setNetwork(false)

    }
  }





  var connection_state = "stop"
  function connect_server() {
    navigator.getUserMedia =
      navigator.mediaDevices?.getUserMedia || navigator.mediaDevices?.mozGetUserMedia || navigator.mediaDevices?.msGetUserMedia || navigator.mediaDevices?.webkitGetUserMedia
    if (!navigator.getUserMedia) {
      fail("No getUserMedia() available.")
    }
    if (!MediaRecorder) {
      fail("No MediaRecorder available.")
    }

    var socketOptions = {
      /*secure: true, reconnection: true, reconnectionDelay: 1000, timeout: 15000, pingTimeout: 15000, pingInterval: 45000,*/ query: {
        framespersecond: framerate,
        audioBitrate: audiobitrate,
      },
    }

    //start socket connection
    window._socket = io.connect(socketio_address, socketOptions)
    // console.log("ping interval =", socket.pingInterval, " ping TimeOut" = socket.pingTimeout);
    //output_message.innerHTML=socket;

    window._socket.on("connect_timeout", timeout => {
      console.log("connection_state on connection timeout= " + timeout)
      // set_output_message("Connection timed out")
      // set_status("gray")
      setNetwork(false)
    })
    window._socket.on("error", error => {
      console.log("connection_state on connection error= " + error)
      // set_output_message("Connection error")
      // set_status("gray")
      setNetwork(false)
    })

    window._socket.on("connect_error", function () {
      console.log("connection_state on connection error= " + connection_state)
      // set_output_message("Connection Failed")
      // set_status("gray")
      setNetwork(false)
    })

    window._socket.on("message", function (m) {
      console.log("connection_state on message= " + connection_state)
      console.log("recv server message", m)
      // show_output("SERVER:" + m)
    })

    window._socket.on("fatal", function (m) {
      // show_output("Fatal ERROR: unexpected:" + m)
      //alert('Error:'+m);
      console.log("fatal socket error!!", m)
      console.log("connection_state on fatal error= " + connection_state)
      //already stopped and inactive
      console.log("media recorder restarted")
      // set_status("gray")

      //mediaRecorder.start();
      setNetwork(false)
      connection_state = "stop"
      //button_start.disabled=true;
      //button_server.disabled=false;
      //document.getElementById('button_start').disabled=true;
      //restart the server

      if (reconnect) {
        //timedCount();
        // set_output_message("server is reload!")
        console.log("server is reloading!")
        // set_status("gray")
      }
      //should reload?
    })

    window._socket.on("ffmpeg_stderr", function (m) {
      //this is the ffmpeg output for each frame
      // show_output("FFMPEG:" + m)
    })

    window._socket.on("disconnect", function (reason) {
      console.log("connection_state disconec= " + connection_state)
      // show_output("ERROR: server disconnected!")
      console.log("ERROR: server disconnected!" + reason)
      // set_status("gray")
      //reconnect the server
      connect_server()

      //socket.open();
      //mediaRecorder.stop();
      setNetwork(false)
      connection_state = "stop"
      //button_start.disabled=true;
      //button_server.disabled=false;
      //	document.getElementById('button_start').disabled=true;
      //var oo=document.getElementById("checkbox_Reconection");
      if (reconnect) {
        //timedCount();
        // set_output_message("server is reloading!")
        console.log("server is reloading!")
      }
    })
    setNetwork(true)
    connection_state = "ready"
    console.log("connection_state = " + connection_state)
    // set_disabled({ ...disabled, button_start: false, button_stop: false, button_server: true })
    // set_status("green")

    // set_output_message("connect server successful")
  }





  function video_show(stream) {
    if (stream) {
      if ("srcObject" in output_video.current) {
        output_video.current.muted = true
        output_video.current.srcObject = new MediaStream(stream)
        console.log(output_video.current.srcObject)
      } else {
        output_video.current.src = window.URL.createObjectURL(stream)
        console.log(output_video.current.src)
      }
      output_video.current.onloadedmetadata = function (e) {
        output_video.current.play()
      }
    }
  }
  if (start === "loading") {
    return (<LoadingScreen setStart={setStart} />)
  } else if (start === true) {
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
            <video id="output_video" ref={output_video} autoPlay={true} className={sty.video} />
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
          <VerticalLinearStepper stream={stream} videoRef={output_video} mediaRecorder={mediaRecorder} />
        </Grid>
      </Grid>
    )
  } else {
    return (
      <Grid
        container
        className={sty.root}
        style={{
          backgroundPositionX: bgPosition,
        }}>
        <Grid item sm={7} className={sty.g_sec1}>
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

        <Grid item sm={5} className={sty.g_sec2} container justify="center" alignContent="center">
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
                    {camera === true ? <CheckCircleOutline color="secondary" /> : camera === false ? <Info color="error" /> : <CircularProgress size={20} color="secondary" />}
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </CardContent>
            <CardActions>
              <Button onClick={handleStart} disabled={!camera || !network} style={{ marginLeft: "auto" }} color="primary" size="large" startIcon={<VideoCall />} variant="outlined">
                get stared
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

export default GetStarted

const styles = makeStyles(theme => ({
  root: {
    minHeight: "100vh",
    background: 'url("' + require("../../static/bg-art.png").default + '") no-repeat',
    backgroundSize: "contain",
    transition: "background 5s ease-out",

    "&::before": {
      zIndex: -1,
      content: '""',
      display: "block",
      height: 180,
      width: 200,
      position: "absolute",
      bottom: "16%",
      left: 0,
      backgroundColor: theme.palette.primary.main,
    },
    "&::after": {
      zIndex: -1,
      content: '""',
      display: "block",
      height: 180,
      width: 200,
      position: "absolute",
      bottom: "16%",
      right: 0,
      backgroundColor: theme.palette.primary.main,
    },
  },
  g_sec1: {
    padding: "5%",
    position: "relative",
  },
  // g_sec2: {},
  background: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#F1ECE4",
    height: "100%",
    width: 400,
    zIndex: 1,
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  bgGame: {
    position: "absolute",
    bottom: "10%",
    left: 12,
  },

  //
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
