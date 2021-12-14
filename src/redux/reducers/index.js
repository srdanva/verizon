import { combineReducers } from 'redux';
import auth from './auth';
import api from './api';

export default combineReducers({
  api,
  auth,
});
