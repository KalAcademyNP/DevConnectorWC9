import { CLEAR_ERRORS, SET_ERROR } from "../actions/types";

const initialState = {};

export default function(state=initialState, action) {
  switch(action.type){
    case SET_ERROR:
      return action.payload;
    case CLEAR_ERRORS:
      return state;
    default:
      return state;
  }
}