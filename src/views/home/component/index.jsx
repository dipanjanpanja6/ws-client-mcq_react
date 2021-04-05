import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"
import StepContent from "@material-ui/core/StepContent"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { LowPriority, Send, VideoCall } from "@material-ui/icons"
import LinearProgressWithLabel from "../../../components/LinearProgressWithLabel"
import { useSelector } from "react-redux"

export default function VerticalLinearStepper({ stream, videoRef, mediaRecorder, ...props }) {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const [progress, setProgress] = useState(0)
  const [recording, setRecording] = useState(false)
  const questions_set = useSelector(state => state.questions.questions_set)
  const timer = React.useRef()
  const countdown = React.useRef()

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  const handleNext = ({ time }) => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setProgress(0)
    countdown.current = window.setInterval(() => {
      setProgress(e => e < 100 && e + 1)
    }, time / 100)

    startRecord()
    setRecording(true)

    timer.current = window.setTimeout(() => {
      setRecording(false)
      setProgress(100)
      stopRecord()
      clearInterval(countdown.current)
      setActiveStep(prevActiveStep => prevActiveStep + 1)
      setSkipped(newSkipped)
    }, time)
  }

  const isStepSkipped = step => {
    return skipped.has(step)
  }
  const handleSkip = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values())
      newSkipped.add(activeStep)
      return newSkipped
    })
  }
  // const handleBack = () => {
  //   setActiveStep(prevActiveStep => prevActiveStep - 1)
  // }
  const handleReset = () => {
    setActiveStep(0)
  }

  var chunks = []
  const startRecord = () => {
    // history.replace("/start")
    // setStart(true)

    mediaRecorder.current.start(250)
    console.log("mediaRecorder state =>", mediaRecorder.current.state) // > recording
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
    mediaRecorder.current.ondataavailable = function (e) {
      // window._socket.emit("binarystream", e.data)
      // connection_state = "start"
      chunks.push(e.data)
    }

    // window._socket.emit("config_rtmpDestination", state.option_url)
    // window._socket.emit("start", "start")

    // video_show(stream) //only show locally, not remotely
  }
  function stopRecord() {
    mediaRecorder.current.stop()
    // callback for onStop function
    recordOnStop()
    console.log("mediaRecorder state =>", mediaRecorder.current.state)
    console.log("stopRecord() call")
  }
  function recordOnStop() {
    //  event handler stop of recording
    console.log("recordOnStop() call")

    var blob = new Blob(chunks, { type: "video/mp4" })
    chunks = []
    // creates a DOMString containing a URL representing
    // the object given in the parameter
    // setState({ audioURL: window.URL.createObjectURL(blob) })
    console.log({ audioURL: window.URL.createObjectURL(blob) })
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.heading}>
        Answer Following
        <br /> Questions
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical" style={{ background: "transparent" }}>
        {questions_set.map((q, index) => {
          const stepProps = {}

          if (isStepSkipped(index)) {
            stepProps.completed = false
          }
          return (
            <Step key={q.id} {...stepProps}>
              <StepLabel>Question {index + 1}</StepLabel>
              <StepContent>
                <Typography>{q.ques}</Typography>
                {recording && <LinearProgressWithLabel value={progress} />}
                <div className={classes.actionsContainer}>
                  {!recording ? (
                    <div>
                      {/* <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                      Back
                    </Button> */}

                      <Button variant="contained" color="primary" onClick={() => handleNext(q)} className={classes.button} startIcon={<VideoCall />}>
                        {/* {activeStep === questions_set.length - 1 ? "Finish" : "get started"} */}
                        record answer
                      </Button>
                      <Button variant="outlined" color="primary" onClick={handleSkip} className={classes.button} startIcon={<LowPriority />}>
                        Skip
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button variant="outlined" color="primary" onClick={handleSkip} className={classes.button} startIcon={<LowPriority />}>
                        Submit
                      </Button>
                    </>
                  )}
                </div>
              </StepContent>
            </Step>
          )
        })}
      </Stepper>
      {/* {activeStep === questions_set.length && ( */}
      <div style={{ flex: 1 }}></div>
      <Paper square elevation={0} className={classes.resetContainer}>
        <div>
          <Typography variant="body2">Attempted 10/10</Typography>
          <Typography style={{ fontWeight: "bold" }}>Total Answered 10</Typography>
        </div>

        <Button onClick={handleReset} className={classes.button} variant="contained" color="secondary" startIcon={<Send />}>
          Finished
        </Button>
      </Paper>
      {/* )} */}
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
    display: "flex",
    justifyContent: "flex-end",
  },
  resetContainer: {
    padding: theme.spacing(3, 2),
    position: "sticky",
    bottom: 0,
    right: 0,
    left: 0,
    display: "flex",
    justifyContent: "space-between",
    background: "#fafafa",
  },
  heading: {
    fontWeight: "bold",
    padding: "15px 0" /* position: "sticky", top: 0, background: "#fafafa", zIndex: 1000*/,
    padding: theme.spacing(2),
  },
}))
