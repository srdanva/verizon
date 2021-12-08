import { GET_AUTH_TOKEN } from 'redux/types';

export function getAuthToken({ authToken }) {
  return {
    type: GET_AUTH_TOKEN,
    props: {
      authToken,
    },
  };
}

export default {
  getAuthToken,
};
