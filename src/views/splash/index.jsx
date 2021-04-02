import { Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core"
import React from "react"

function SplashScreen() {
  return (
    <Grid container>
      <Grid item sm={6}></Grid>
      <Grid item sm={6}>
        <Card>
          <CardContent>
            <Typography>Make Sure</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default SplashScreen
