import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import registrationsReducer from './registrationsSlice'

const STORAGE_KEY = 'event-management-auth'
const REGISTRATIONS_STORAGE_KEY = 'event-management-registrations'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    registrations: registrationsReducer,
  },
})

store.subscribe(() => {
  const { users, currentUser } = store.getState().auth
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ users, currentUser }))
  localStorage.setItem(
    REGISTRATIONS_STORAGE_KEY,
    JSON.stringify(store.getState().registrations),
  )
})
