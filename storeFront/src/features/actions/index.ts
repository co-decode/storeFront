import {ActionType} from "../action-types"
interface LoginAction {
  type: ActionType.LOGIN;
  payload: number;
}

export type Action = LoginAction;
