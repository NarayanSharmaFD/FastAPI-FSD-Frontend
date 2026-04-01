import React, { useState, useCallback } from 'react'
import { Snackbar, Alert } from '@mui/material'

export const ToastContext = React.createContext()

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback(
    (message, severity = 'info', duration = 3000) => {
      const id = Date.now()
      const toast = { id, message, severity }
      setToasts((prev) => [...prev, toast])

      if (duration) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id))
        }, duration)
      }

      return id
    },
    []
  )

  const closeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

/**
 * Toast Container Component
 * Displays all active toasts
 */
const ToastContainer = ({ toasts, onClose }) => {
  return (
    <>
      {toasts.map((toast, index) => (
        <Snackbar
          key={toast.id}
          open={true}
          autoHideDuration={3000}
          onClose={() => onClose(toast.id)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          sx={{ top: `${index * 80}px !important` }}
        >
          <Alert
            onClose={() => onClose(toast.id)}
            severity={toast.severity}
            sx={{ width: '100%' }}
          >
            {toast.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  )
}
