import { lazy, useEffect } from "react"
import { Route, Switch, Redirect, BrowserRouter as Router, useLocation } from "react-router-dom"
import App from "../test/App"
import GetStarted from "../views/getStarted"
import HomeScreen from "../views/home"
import LoadingScreen from "../views/loading"
import FinishedScreen from "../views/finished"
// import withSuspense from "../hoc/withSuspense"

const RouterContainer = () => {
  return (
    <div>
      <Router>
        <ScrollToTop />
        <Switch>
          <Route exact path="/finished" component={FinishedScreen} />
          <Route exact path="/start" component={HomeScreen} />
          <Route exact path="/load" component={LoadingScreen} />
          <Route exact path="/" component={GetStarted} />
          {/* <Route render={() => <Redirect to="/404" />} /> */}

          <Route exact path="/test" component={App} />
        </Switch>
      </Router>
    </div>
  )
}

export default RouterContainer

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
