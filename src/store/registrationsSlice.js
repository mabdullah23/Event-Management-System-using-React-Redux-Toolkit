import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'event-management-registrations'

function loadRegistrations() {
  const savedState = localStorage.getItem(STORAGE_KEY)

  if (!savedState) {
    return { byUser: {} }
  }

  try {
    const parsedState = JSON.parse(savedState)
    if (parsedState && parsedState.byUser && typeof parsedState.byUser === 'object') {
      return { byUser: parsedState.byUser }
    }
  } catch (error) {
    console.error('Unable to restore saved event registrations.', error)
  }

  return { byUser: {} }
}

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: loadRegistrations(),
  reducers: {
    registerEvent(state, action) {
      const { userEmail, event } = action.payload
      const registrations = state.byUser[userEmail] ?? []

      if (!registrations.some((registration) => registration.id === event.id)) {
        registrations.push(event)
        state.byUser[userEmail] = registrations
      }
    },
    cancelRegistration(state, action) {
      const { userEmail, eventId } = action.payload
      const registrations = state.byUser[userEmail] ?? []
      state.byUser[userEmail] = registrations.filter((event) => event.id !== eventId)
    },
  },
})

export const { registerEvent, cancelRegistration } = registrationsSlice.actions
export const selectRegistrationsForUser = (state, userEmail) =>
  state.registrations.byUser[userEmail] ?? []
export default registrationsSlice.reducer
