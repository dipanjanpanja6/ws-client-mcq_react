import { QUESTIONS_SET } from "../type"

const initialState = {
    questions_set: null,
}

export default function (state = initialState, actions) {
    switch (actions.type) {
        case QUESTIONS_SET:
            return {
                ...state,
                questions_set: actions.payload,
            }

        default:
            return state
    }
}
