import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'event-management-auth'

function loadAuthState() {
  const savedState = localStorage.getItem(STORAGE_KEY)

  if (!savedState) {
    return { users: [], currentUser: null, error: null }
  }

  try {
    const parsedState = JSON.parse(savedState)

    if (Array.isArray(parsedState.users)) {
      return {
        users: parsedState.users,
        currentUser: parsedState.currentUser ?? null,
        error: null,
      }
    }
  } catch (error) {
    console.error('Unable to restore the saved authentication session.', error)
  }

  return { users: [], currentUser: null, error: null }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthState(),
  reducers: {
    register(state, action) {
      const { name, email, password } = action.payload
      const normalizedEmail = email.trim().toLowerCase()

      if (state.users.some((user) => user.email === normalizedEmail)) {
        state.error = 'An account with this email already exists.'
        return
      }

      const user = { name: name.trim(), email: normalizedEmail, password }
      state.users.push(user)
      state.currentUser = { name: user.name, email: user.email }
      state.error = null
    },
    login(state, action) {
      const { email, password } = action.payload
      const user = state.users.find(
        (candidate) =>
          candidate.email === email.trim().toLowerCase() &&
          candidate.password === password,
      )

      if (!user) {
        state.error = 'Invalid email or password.'
        return
      }

      state.currentUser = { name: user.name, email: user.email }
      state.error = null
    },
    logout(state) {
      state.currentUser = null
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
})

export const { register, login, logout, clearError } = authSlice.actions
export const selectCurrentUser = (state) => state.auth.currentUser
export const selectAuthError = (state) => state.auth.error
export default authSlice.reducer
