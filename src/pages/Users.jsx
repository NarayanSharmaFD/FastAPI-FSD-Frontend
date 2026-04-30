import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../store/usersSlice'
import {
  fetchRoles,
} from '../store/rolesSlice'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  CircularProgress,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  TablePagination,
  InputAdornment,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Search,
  PersonAdd,
} from '@mui/icons-material'
import { useToast } from '../context/ToastContext'
import { useConfirmation } from '../context/ConfirmationContext'

const Users = () => {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const { showConfirm } = useConfirmation()
  const { items: users, status, error } = useSelector((state) => state.users)
  const { items: roles } = useSelector((state) => state.roles)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
    role_id: 1,
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers())
    }
    dispatch(fetchRoles())
  }, [status, dispatch])

  // Show errors as toasts
  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  const handleOpen = (user = null) => {
    if (user) {
      setEditId(user.id)
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name || '',
        password: '',
        role_id: user.role_id || 1,
      })
    } else {
      setEditId(null)
      setFormData({
        username: '',
        email: '',
        full_name: '',
        password: '',
        role_id: 1,
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = async () => {
    // Validation
    if (!formData.username.trim()) {
      showToast('Username is required', 'warning')
      return
    }
    if (!formData.email.trim()) {
      showToast('Email is required', 'warning')
      return
    }
    if (!editId && !formData.password.trim()) {
      showToast('Password is required for new user', 'warning')
      return
    }

    try {
      if (editId) {
        await dispatch(updateUser({ id: editId, data: formData })).unwrap()
        showToast('User updated successfully', 'success')
      } else {
        await dispatch(createUser(formData)).unwrap()
        showToast('User created successfully', 'success')
      }
      setOpen(false)
    } catch (err) {
      showToast(err || 'Operation failed', 'error')
    }
  }

  const handleDelete = (id, username) => {
    showConfirm(
      'Delete User?',
      `Are you sure you want to delete user "${username}"? This action cannot be undone.`,
      async () => {
        try {
          await dispatch(deleteUser(id)).unwrap()
          showToast('User deleted successfully', 'success')
        } catch (err) {
          showToast(err || 'Failed to delete user', 'error')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  // Filter users by search term
  const filteredUsers = (users || []).filter(
    (user) => {
      const search = (searchTerm || '').toLowerCase()
      return (
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.full_name && user.full_name.toLowerCase().includes(search))
      )
    }
  )

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error'
      case 'task_creator':
        return 'warning'
      case 'read_only':
        return 'default'
      default:
        return 'default'
    }
  }

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Users Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={() => handleOpen()}
        >
          Add New User
        </Button>
      </Box>

      {/* Search */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by username, email, or name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setPage(0)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PersonAdd sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {users.length === 0 ? 'No users yet' : 'No users match your search'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {users.length === 0
              ? 'Create your first user to get started'
              : 'Try adjusting your search criteria'}
          </Typography>
          {users.length === 0 && (
            <Button variant="contained" onClick={() => handleOpen()}>
              Create First User
            </Button>
          )}
        </Paper>
      )}

      {/* Table */}
      {filteredUsers.length > 0 && (
        <>
          <Paper sx={{ overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Full Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.full_name || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.replace('_', ' ')}
                        color={getRoleColor(user.role)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleOpen(user)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(user.id, user.username)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10))
                setPage(0)
              }}
            />
          </Paper>
        </>
      )}

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editId ? 'Edit User' : 'Create New User'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            fullWidth
            disabled={!!editId}
            error={!formData.username && open}
          />
          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            fullWidth
            disabled={!!editId}
            error={!formData.email && open}
          />
          <TextField
            label="Full Name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            fullWidth
            helperText={
              editId ? 'Leave empty to keep current password' : 'Required for new users'
            }
            error={!formData.password && !editId && open}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role_id}
              label="Role"
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.role_name.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Users
