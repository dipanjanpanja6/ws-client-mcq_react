// import './App.css'
import { io } from "socket.io-client"
import { useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { AppBar, Button, ButtonGroup, Grid, Icon, IconButton, TextField, Toolbar, Typography } from "@material-ui/core"
import "./App.css"

const socketio_address = "http://localhost:1437",
  height = 240,
  width = 240

var connection_state = "stop",
  t,
  socket

function App() {
  const history = useHistory()
  var mediaRecorder = useRef(null)
  var output_video = useRef(null)

  const [state, set_state] = useState({ option_url: "rtmp://192.168.0.98/live/key" })

  const [output_message, set_output_message] = useState("")
  const [status, set_status] = useState("grey")
  const [disabled, set_disabled] = useState({ button_start: true, button_stop: true, button_server: false })
  const [reconnect, set_reconnect] = useState(true)
  const [framerate, set_framerate] = useState(15)
  const [audiobitrate, set_audiobitrate] = useState(22050)

  const output_console = useRef(null)

  const handleChange = e => {
    set_reconnect(e.target.checked)

    set_state({ ...state, [e.target.name]: e.target.value })
  }

  function fail(str) {
    alert(str + "\nUnable to access the camera Please ensure you are on HTTPS and using Firefox or Chrome.")
    window.location.replace("http://mozilla.org/firefox")
  }

  function video_show(stream) {
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
    // console.log(window.URL.createObjectURL(stream));

    output_video.current.addEventListener(
      "loadedmetadata",
      function (e) {
        set_output_message("Local video source size:" + output_video.current.videoWidth + "x" + output_video.current.videoHeight)
      },
      false
    )
  }

  function show_output(str) {
    output_console.current.value += "\n" + str
    output_console.current.scrollTop = output_console.current.scrollHeight
  }

  function timedCount() {
    var oo = document.getElementById("checkbox_Reconection")
    if (reconnect) {
      console.log("timed count connection_state = " + connection_state)
      if (connection_state == "ready") {
        console.log("reconnecting and restarting the media stream")
        //do I need to rerun the request media?

        connect_server()
        set_disabled({ ...disabled, button_start: false, button_server: true })
      } else {
        console.log("not ready yet - wating 1000ms")
        t = setTimeout(timedCount(), 1000)
        connect_server()
        set_output_message("try connect server ...")
        set_disabled({ ...disabled, button_start: true, button_server: false })
      }
    } else {
      //reconnection is off
      console.log("reconnection is off, buttons hcnage and we are done.")
      set_disabled({ ...disabled, button_start: true, button_server: false })
    }
  }

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
    socket = io.connect(socketio_address, socketOptions)
    // console.log("ping interval =", socket.pingInterval, " ping TimeOut" = socket.pingTimeout);
    //output_message.innerHTML=socket;

    socket.on("connect_timeout", timeout => {
      console.log("connection_state on connection timeout= " + timeout)
      set_output_message("Connection timed out")
      set_status("gray")
    })
    socket.on("error", error => {
      console.log("connection_state on connection error= " + error)
      set_output_message("Connection error")
      set_status("gray")
    })

    socket.on("connect_error", function () {
      console.log("connection_state on connection error= " + connection_state)
      set_output_message("Connection Failed")
      set_status("gray")
    })

    socket.on("message", function (m) {
      console.log("connection_state on message= " + connection_state)
      console.log("recv server message", m)
      show_output("SERVER:" + m)
    })

    socket.on("fatal", function (m) {
      show_output("Fatal ERROR: unexpected:" + m)
      //alert('Error:'+m);
      console.log("fatal socket error!!", m)
      console.log("connection_state on fatal error= " + connection_state)
      //already stopped and inactive
      console.log("media recorder restarted")
      set_status("gray")

      //mediaRecorder.start();
      //connection_state="stop";
      //button_start.disabled=true;
      //button_server.disabled=false;
      //document.getElementById('button_start').disabled=true;
      //restart the server

      if (reconnect) {
        //timedCount();
        set_output_message("server is reload!")
        console.log("server is reloading!")
        set_status("gray")
      }
      //should reload?
    })

    socket.on("ffmpeg_stderr", function (m) {
      //this is the ffmpeg output for each frame
      show_output("FFMPEG:" + m)
    })

    socket.on("disconnect", function (reason) {
      console.log("connection_state disconec= " + connection_state)
      show_output("ERROR: server disconnected!")
      console.log("ERROR: server disconnected!" + reason)
      set_status("gray")
      //reconnect the server
      connect_server()

      //socket.open();
      //mediaRecorder.stop();
      //connection_state="stop";
      //button_start.disabled=true;
      //button_server.disabled=false;
      //	document.getElementById('button_start').disabled=true;
      //var oo=document.getElementById("checkbox_Reconection");
      if (reconnect) {
        //timedCount();
        set_output_message("server is reloading!")
        console.log("server is reloading!")
      }
    })

    connection_state = "ready"
    console.log("connection_state = " + connection_state)
    set_disabled({ ...disabled, button_start: false, button_stop: false, button_server: true })
    set_status("green")

    set_output_message("connect server successful")
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
      // const stream = await navigator.mediaDevices.getDisplayMedia({
      //   video: { mediaSource: "screen" },
      // })

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      let supported = navigator.mediaDevices.getSupportedConstraints()
      console.log(supported)
      mediaRecorder.current = new MediaRecorder(stream)
      // var Media = (new MediaRecorder(stream));
      video_show(stream) //only show locally, not remotely

      set_status("red")

      set_disabled({ ...disabled, button_start: true, button_stop: false, button_server: true })
      // console.log(new MediaRecorder(stream));
      // setMediaStream = new MediaRecorder(stream);
      // mediaRecorders(new MediaRecorder(stream))
      mediaRecorder.current.start(250)

      //show remote stream
      var livestream = document.getElementsByClassName("Livestream")
      console.log("adding live stream")
      livestream.innerHtml = "test"

      mediaRecorder.current.onstop = function (e) {
        console.log("stopped!")
        console.log(e)
        //stream.stop();
      }

      mediaRecorder.current.onpause = function (e) {
        console.log("media recorder paused!!")
        console.log(e)
        //stream.stop();
      }

      mediaRecorder.current.onerror = function (event) {
        let error = event.error
        console.log("error", error.name)
      }
      //document.getElementById('button_start').disabled=false;

      mediaRecorder.current.ondataavailable = function (e) {
        // console.log(socket);
        socket.emit("binarystream", e.data)
        connection_state = "start"
        //chunks.push(e.data);
      }
      // console.log(Media);
      // setMediaStream(Media)

      socket.emit("config_rtmpDestination", state.option_url)
      socket.emit("start", "start")
    } catch (err) {
      console.log("The following error occured: " + err)
      show_output("Local getUserMedia ERROR:" + err)
      set_output_message("Local video source size is not support or No camera ?" + output_video.current.videoWidth + "x" + output_video.current.videoHeight)
      connection_state = "stop"
      set_disabled({ ...disabled, button_start: true, button_server: false })
    }
  }

  function stopStream() {
    console.log("stop pressed:")
    //stream.getTracks().forEach(track => track.stop())
    mediaRecorder.current.stop()
    set_status("gray")

    set_disabled({ ...disabled, button_start: true, button_stop: true, button_server: false })
  }

  return (
    <>
      <AppBar color="transparent" elevation={0} style={{ background: "black", color: "#fff" }}>
        <Toolbar>
          <Typography>RTMP</Typography>
          <div style={{ flex: 1 }}></div>
          <svg height="20" width="20">
            <circle cx="10" cy="10" r="10" stroke="black" stroke-width="1" fill={status} />
          </svg>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container direction="column" alignItems="center" justify="center">
        {/* <Grid item>

        </Grid> */}
        {/* <label for="option_width" class="form">Size:</label>
        <input class="form" type="text" id="option_width" value="240" /> &times;
      <input class="form" type="text" id="option_height" value="240" />
        <br /><br />
        <label class="form" for="option_framerate">Frame Rate:</label>
        <input class="form" type="text" id="option_framerate" value="15" />
        <br /><br />
        <label class="form" for="option_framerate">Audio bitrate:</label>
        <select class="form" id="option_bitrate">
          <option value="22050">22050</option>
          <option value="44100">44100</option>
          <option value="11025">11025</option>
        </select> */}
        <Grid container direction="column" style={{ padding: "12px 0" }} alignItems="center">
          <video id="output_video" ref={output_video} autoplay={true} style={{ maxWidth: "100%" }} />
          <Typography variant="caption" color="textSecondary">
            {output_message}
          </Typography>

          {/* <video id="videoElement" preload="none"  ></video> */}
        </Grid>

        <input class="form" type="hidden" id="socket.io_address" value="/" />
        <TextField type="text" size="small" variant="outlined" name="option_url" label="RTMP Destination" style={{ width: "33%" }} value={state.option_url} onChange={handleChange} />

        <input class="form" type="checkbox" style={{ display: "none" }} id="checkbox_Reconection" onChange={handleChange} checked="true" />
        <label class="form" style={{ display: "none" }}>
          Reconnection{" "}
        </label>

        <Typography variant="h3">Connect the server, then start streaming.</Typography>

        <Grid item style={{ maxWidth: 700 }} container justify="center" alignItems="center">
          <ButtonGroup fullWidth size="large" variant="contained" color="primary" style={{ margin: "12px 0" }}>
            <Button color="primary" variant="outlined" disabled={disabled.button_server} onClick={connect_server}>
              Connect Server
            </Button>
            <Button variant="outlined" disabled={disabled.button_start} onClick={requestMedia}>
              Start Streaming
            </Button>
            <Button color="secondary" disabled={disabled.button_stop} onClick={stopStream}>
              Stop Streaming
            </Button>
          </ButtonGroup>

          <Typography color="textSecondary" gutterBottom>
            Hint: Keep an eye on the status window, the encoding value must stay above 1x, or your stream will start to lag. Use a smaller screen size, or change the frame rate in the
            Constraints variable.
          </Typography>
        </Grid>

        <textarea
          readonly="true"
          ref={output_console}
          id="output_console"
          rows={7}
          style={{
            width: "55%",
            color: "green",
            background: "black",
            border: "none",
          }}
        />
      </Grid>
    </>
  )
}

export default App
