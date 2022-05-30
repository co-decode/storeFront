import { ActionType } from "../action-types"
import {Dispatch} from "redux"
import {Action} from "../actions/index"

const addTotal = (amount: number) => {
    return (dispatch: Dispatch<Action>) => {
        dispatch({
            type:ActionType.LOGIN,
            payload:amount
        })
    }
}