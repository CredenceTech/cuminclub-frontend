import { configureStore } from '@reduxjs/toolkit'
import mealdata from './mealdata'

export const store = configureStore({
  reducer: {
    mealData: mealdata
  },
})