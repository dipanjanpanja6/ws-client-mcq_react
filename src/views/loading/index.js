import { Grid, LinearProgress, Typography } from "@material-ui/core"
import { useSnackbar } from "notistack"
import React, { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { useHistory } from "react-router"
import { getQuestions_api } from "../../apis/getQuestions"
import { QUESTIONS_SET } from "../../redux/type"
import miniLogo from "../../static/mini-logo.svg"
function LoadingScreen({ setStart, ...props }) {
  const [finish, setFinish] = useState(false)
  const history = useHistory()
  const dispatch = useDispatch()
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const timer = useRef(null)
  useEffect(() => {
    // history.push("/start")

    getQuestions()

    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  const getQuestions = async () => {
    try {
      const { data } = await getQuestions_api()
      if (data.success) {
        dispatch({ type: QUESTIONS_SET, payload: data.data })
        setFinish(true)
        timer.current = window.setTimeout(() => {
          setStart(true)
        }, 2000)
      } else {
        enqueueSnackbar(data.message, { variant: "error" })
        setStart(false)
      }
    } catch (error) {
      enqueueSnackbar("Check your internet Connection.", { variant: "error" })
      setStart(false)
    }
  }

  return (
    <Grid container justify="center" alignItems="center" direction="column" style={{ minHeight: "100vh" }}>
      <img style={{ transform: finish ? "rotate(360deg)" : "rotate(177deg)", transition: "all 1s cubic-bezier(0.76, 0.4, 0.8, 0.48) 0s" }} src={miniLogo} width={100} />
      <Typography style={{ marginTop: 12, marginBottom: 27 }}>Initializing</Typography>
      <LinearProgress style={{ width: 220 }} />
    </Grid>
  )
}

export default LoadingScreen
