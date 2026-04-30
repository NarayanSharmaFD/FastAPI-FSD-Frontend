/**
 * Roles management page
 * Allows admin to create, update, and delete roles with custom permissions.
 * Only accessible to admin users.
 */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchRoles,
  createRole,
  updateRole,
  deleteRole,
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
  Chip,
  TablePagination,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Search,
  Shield,
} from '@mui/icons-material'
import { useToast } from '../context/ToastContext'
import { useConfirmation } from '../context/ConfirmationContext'

const Roles = () => {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const { showConfirm } = useConfirmation()
  const { items: roles, status, error } = useSelector((state) => state.roles)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    role_name: '',
    description: '',
    permissions: {
      project: { create: false, read: true, update: false, delete: false },
      task: { create: false, read: true, update: false, delete: false },
    },
  })

  // Initialize
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchRoles())
    }
  }, [status, dispatch])

  // Show errors as toasts
  useEffect(() => {
    if (error) {
      showToast(String(error), 'error')
    }
  }, [error, showToast])

  const handleOpen = (role = null) => {
    if (role) {
      setEditId(role.id)
      setFormData({
        role_name: role.role_name || '',
        description: role.description || '',
        permissions: role.permissions || {
          project: { create: false, read: true, update: false, delete: false },
          task: { create: false, read: true, update: false, delete: false },
        },
      })
    } else {
      setEditId(null)
      setFormData({
        role_name: '',
        description: '',
        permissions: {
          project: { create: false, read: true, update: false, delete: false },
          task: { create: false, read: true, update: false, delete: false },
        },
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditId(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePermissionChange = (resource, action, value) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [resource]: {
          ...prev.permissions[resource],
          [action]: value,
        },
      },
    }))
  }

  const handleSave = async () => {
    if (!formData.role_name.trim()) {
      showToast('Role name is required', 'error')
      return
    }

    try {
      if (editId) {
        await dispatch(updateRole({ id: editId, data: formData }))
        showToast('Role updated successfully', 'success')
      } else {
        await dispatch(createRole(formData))
        showToast('Role created successfully', 'success')
      }
      handleClose()
    } catch (err) {
      showToast(String(err), 'error')
    }
  }

  const handleDelete = (role) => {
    if (role.is_system_role) {
      showToast('Cannot delete system roles', 'error')
      return
    }

    showConfirm(
      'Delete Role?',
      `Are you sure you want to delete the role "${role.role_name}"?`,
      async () => {
        try {
          await dispatch(deleteRole(role.id)).unwrap()
          showToast('Role deleted successfully', 'success')
        } catch (err) {
          showToast(String(err), 'error')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  const filteredRoles = (roles || []).filter((role) =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const paginatedRoles = filteredRoles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  if (status === 'loading') {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Shield /> Role Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          New Role
        </Button>
      </Box>

      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search roles..."
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
      </Box>

      {/* Roles Table */}
      <Paper sx={{ mb: 3, overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Role Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Project Perms</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Task Perms</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRoles.map((role) => (
              <TableRow key={role.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{role.role_name}</TableCell>
                <TableCell>{role.description || '-'}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {role.permissions?.project?.create && <Chip label="C" size="small" color="primary" />}
                    {role.permissions?.project?.read && <Chip label="R" size="small" variant="outlined" />}
                    {role.permissions?.project?.update && <Chip label="U" size="small" color="info" />}
                    {role.permissions?.project?.delete && <Chip label="D" size="small" color="error" />}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {role.permissions?.task?.create && <Chip label="C" size="small" color="primary" />}
                    {role.permissions?.task?.read && <Chip label="R" size="small" variant="outlined" />}
                    {role.permissions?.task?.update && <Chip label="U" size="small" color="info" />}
                    {role.permissions?.task?.delete && <Chip label="D" size="small" color="error" />}
                  </Box>
                </TableCell>
                <TableCell>
                  {role.is_system_role ? (
                    <Chip label="System" size="small" color="secondary" />
                  ) : (
                    <Chip label="Custom" size="small" />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => handleOpen(role)}
                    sx={{ mr: 1 }}
                    disabled={role.is_system_role}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => handleDelete(role)}
                    disabled={role.is_system_role}
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
          count={filteredRoles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
        />
      </Paper>

      {/* Dialog for Create/Edit */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editId ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Role Name"
            name="role_name"
            value={formData.role_name}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 2 }}
            disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            multiline
            rows={2}
            sx={{ mb: 3 }}
            disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
          />

          {/* Permissions Section */}
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Permissions
          </Typography>

          {/* Project Permissions */}
          <Card sx={{ mb: 2 }}>
            <CardHeader title="Project Permissions" sx={{ pb: 1 }} />
            <CardContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.project.create}
                      onChange={(e) => handlePermissionChange('project', 'create', e.target.checked)}
                      disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
                    />
                  }
                  label="Create Projects"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.project.read}
                      onChange={(e) => handlePermissionChange('project', 'read', e.target.checked)}
                      disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
                    />
                  }
                  label="Read Projects"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.project.update}
                      onChange={(e) => handlePermissionChange('project', 'update', e.target.checked)}
                      disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
                    />
                  }
                  label="Update Projects"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.project.delete}
                      onChange={(e) => handlePermissionChange('project', 'delete', e.target.checked)}
                      disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
                    />
                  }
                  label="Delete Projects"
                />
              </FormGroup>
            </CardContent>
          </Card>

          {/* Task Permissions */}
          <Card>
            <CardHeader title="Task Permissions" sx={{ pb: 1 }} />
            <CardContent>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.task.create}
                      onChange={(e) => handlePermissionChange('task', 'create', e.target.checked)}
                      disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
                    />
                  }
                  label="Create Tasks"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.task.read}
                      onChange={(e) => handlePermissionChange('task', 'read', e.target.checked)}
                      disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
                    />
                  }
                  label="Read Tasks"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.task.update}
                      onChange={(e) => handlePermissionChange('task', 'update', e.target.checked)}
                      disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
                    />
                  }
                  label="Update Tasks"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.permissions.task.delete}
                      onChange={(e) => handlePermissionChange('task', 'delete', e.target.checked)}
                      disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
                    />
                  }
                  label="Delete Tasks"
                />
              </FormGroup>
            </CardContent>
          </Card>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={editId && roles.find((r) => r.id === editId)?.is_system_role}
          >
            {editId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Roles
