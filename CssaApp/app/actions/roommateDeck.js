import {ADD_TO_POTENTIAL} from '../constants'

export const addToPoential = (person) => ({
  type: ADD_TO_POTENTIAL,
  payload: person
});
