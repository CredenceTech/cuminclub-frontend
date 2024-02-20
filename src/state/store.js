import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import mealdata from './mealdata';
import cart from './cart';
import cartData from './cartData';
import product from './product';
import user from './user';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cartData', 'user'],
};

const persistedReducer = persistReducer(persistConfig, combineReducers({
  mealData: mealdata,
  cart: cart,
  cartData: cartData,
  product: product,
  user: user
}));

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
