import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

const STORAGE_KEY = 'event-management-auth'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

store.subscribe(() => {
  const { users, currentUser } = store.getState().auth
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ users, currentUser }))
})
