import { SET_POIS } from 'redux/types';

const initialState = {
  pois: [],
};

// eslint-disable-next-line default-param-last
export default function viewer(state = initialState, action) {
  switch (action.type) {
  case SET_POIS:
    return {
      ...state,
      pois: action.props.pois,
    };
  default:
    return state;
  }
}
