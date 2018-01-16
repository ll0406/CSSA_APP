import {SET_PHOTO} from '../constants';

export const setPhoto = (uri) => ({
  type: SET_PHOTO,
  payload: uri
});
