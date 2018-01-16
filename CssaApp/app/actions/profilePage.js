import {GCHANGE, SCHANGE, SET_NAME, SET_BIRTHDAY, SET_PHOTO} from '../constants';

export const gChange = (key) => ({
  type: GCHANGE,
  payload: key
});

export const sChange = (key) => ({
  type: SCHANGE,
  payload: key
});

export const setName = (name) => ({
  type: SET_NAME,
  payload: name
});

export const setBD = (date) => {
  const dateString = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
  return {type: SET_BIRTHDAY, payload: dateString}

}

export const setPhoto = (uri) => ({
  type: SET_PHOTO,
  payload: uri
});

export const submitChange = (user) => ({

})
