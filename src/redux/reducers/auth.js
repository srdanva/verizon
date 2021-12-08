import Cookies from 'js-cookie';
import { GET_AUTH_TOKEN } from 'redux/types';

const initialState = {
  authToken: Cookies.get('access_token') || null,
};

// eslint-disable-next-line default-param-last
export default function viewer(state = initialState, action) {
  switch (action.type) {
  case GET_AUTH_TOKEN:
    return {
      ...state,
      authToken: action.props.authToken,
    };
  default:
    return state;
  }
}
