// Deprecated: AuthContext replaced by Redux Toolkit store (authSlice).
// Keep this file as a no-op shim for legacy imports. Please migrate to use react-redux hooks.
import React from 'react'

export const AuthProvider = ({ children }) => {
  // noop provider to avoid breaking imports; use Redux Provider instead
  return <>{children}</>
}

export const useAuth = () => {
  throw new Error('useAuth is deprecated. Use react-redux useSelector/useDispatch with the auth slice.')
}
