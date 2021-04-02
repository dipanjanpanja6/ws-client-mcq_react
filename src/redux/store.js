import { createStore, combineReducers, applyMiddleware } from "redux"

import { composeWithDevTools } from "redux-devtools-extension"
import thunk from "redux-thunk"
import user from "./reducer/userReduser"
const reducers = combineReducers({ user })

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)))

export default store
