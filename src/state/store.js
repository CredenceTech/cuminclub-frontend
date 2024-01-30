import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import mealdata from './mealdata';
import cart from './cart';
import cartData from './cartData';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cartData'],
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
  mealData: mealdata,
  cart: cart,
  cartData: cartData
}));

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
