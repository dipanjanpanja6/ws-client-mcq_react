import { createStore, combineReducers, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import questions from "./reducer/questionsReducer"

const initialState = {}
const reducers = combineReducers({ questions });

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension")
    return composeWithDevTools(applyMiddleware(middleware))
  }
  return applyMiddleware(middleware)
}


const store = () => createStore(reducers, initialState, bindMiddleware(thunk))


export default store
