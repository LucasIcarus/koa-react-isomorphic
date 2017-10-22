/* @flow */
import { Map } from "immutable";
import { handleActions } from "redux-actions";
import { LOCATION_CHANGE } from "react-router-redux";
import globalizeSelectors from "../../helpers/globalizeSelectors";

export const mountPoint = "routing";

export const selectors = globalizeSelectors(
  {
    selectLocationState: state => state.get("object")
  },
  mountPoint
);

export default handleActions(
  {
    [LOCATION_CHANGE]: (state, { payload }) =>
      state.set("object", {
        locationBeforeTransitions: payload
      })
  },
  // $FlowFixMe
  new Map({
    object: { locationBeforeTransitions: null }
  })
);