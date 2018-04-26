import {createStore, applyMiddleware, compose} from 'redux';
import appReducer from './reducers';
import reducer from './reducers/reducer';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist';
import {AsyncStorage} from 'react-native';
import logger from 'redux-logger';


const store = createStore(
  appReducer,
  compose(
    applyMiddleware(thunk, logger),
    autoRehydrate()
  )
);

persistStore(store, {storage: AsyncStorage})
///persistStore(store, {storage: AsyncStorage}).purge()

export default store;
