import { SET_POIS } from 'redux/types';

export function setPOIs(pois) {
  return {
    type: SET_POIS,
    props: {
      pois,
    },
  };
}

export default {
  setPOIs,
};
