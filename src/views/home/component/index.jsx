import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"
import StepContent from "@material-ui/core/StepContent"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import { LowPriority, Send, VideoCall } from "@material-ui/icons"

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
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

function getSteps() {
  return Array(30).fill("Question ")
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return `For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.`
    case 1:
      return "An ad group contains one or more ads which target a shared set of keywords."
    case 2:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`
    default:
      return "Lorem ipsum dolor sit amet, consectetur adipiscing elit ?"
  }
}

export default function VerticalLinearStepper() {
  const classes = useStyles()
  const [activeStep, setActiveStep] = React.useState(0)
  const [skipped, setSkipped] = React.useState(new Set())
  const steps = getSteps()

  const handleNext = () => {
    let newSkipped = skipped
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values())
      newSkipped.delete(activeStep)
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1)
    setSkipped(newSkipped)
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

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.heading}>
        Answer Following
        <br /> Questions
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical" style={{ background: "transparent" }}>
        {steps.map((label, index) => {
          const stepProps = {}

          if (isStepSkipped(index)) {
            stepProps.completed = false
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel>
                {label}
                {index + 1}
              </StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    {/* <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                      Back
                    </Button> */}

                    <Button variant="contained" color="primary" onClick={handleNext} className={classes.button} startIcon={<VideoCall />}>
                      {activeStep === steps.length - 1 ? "Finish" : "get started"}
                    </Button>
                    <Button variant="outlined" color="primary" onClick={handleSkip} className={classes.button} startIcon={<LowPriority />}>
                      Skip
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          )
        })}
      </Stepper>
      {/* {activeStep === steps.length && ( */}

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
