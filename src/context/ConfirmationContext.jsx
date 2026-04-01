import React, { useState, useCallback } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

/**
 * Confirmation Dialog Context and Hook
 * Usage:
 * const { showConfirm } = useConfirmation()
 * showConfirm(
 *   'Delete Project?',
 *   'This action cannot be undone',
 *   () => console.log('Confirmed')
 * )
 */

export const ConfirmationContext = React.createContext()

export const ConfirmationProvider = ({ children }) => {
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  })

  const showConfirm = useCallback(
    (title, message, onConfirm, confirmText = 'Confirm', cancelText = 'Cancel') => {
      setDialog({
        open: true,
        title,
        message,
        onConfirm,
        confirmText,
        cancelText,
      })
    },
    []
  )

  const handleConfirm = useCallback(() => {
    if (dialog.onConfirm) {
      dialog.onConfirm()
    }
    setDialog((prev) => ({ ...prev, open: false }))
  }, [dialog])

  const handleCancel = useCallback(() => {
    setDialog((prev) => ({ ...prev, open: false }))
  }, [])

  return (
    <ConfirmationContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmationDialog
        {...dialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmationContext.Provider>
  )
}

export const useConfirmation = () => {
  const context = React.useContext(ConfirmationContext)
  if (!context) {
    throw new Error('useConfirmation must be used within ConfirmationProvider')
  }
  return context
}

/**
 * Confirmation Dialog Component
 */
const ConfirmationDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error" autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
