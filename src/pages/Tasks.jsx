import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../store/tasksSlice'
import { fetchUsers } from '../store/usersSlice'
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import { Edit, Delete, Search, CheckCircle, Add } from '@mui/icons-material'
import { useToast } from '../context/ToastContext'
import { useConfirmation } from '../context/ConfirmationContext'

const Tasks = () => {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const { showConfirm } = useConfirmation()
  const { items: tasks, status, error } = useSelector((state) => state.tasks)
  const { items: projects } = useSelector((state) => state.projects)
  const { items: users, status: usersStatus } = useSelector((state) => state.users)
  const { role, user: currentUser } = useSelector((state) => state.auth)
  const { permissions } = useSelector((state) => state.permissions)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'new',
    project_id: '',
    owner_id: '',
    assigned_user_id: '',
    due_date: '',
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks())
    }
  }, [status, dispatch])

  useEffect(() => {
    if (usersStatus === 'idle') {
      dispatch(fetchUsers())
    }
  }, [usersStatus, dispatch])

  // Show errors as toasts
  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  const handleOpen = (task = null) => {
    if (task) {
      setEditId(task.id)
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status || 'new',
        project_id: task.project_id || '',
        owner_id: task.owner_id || '',
        assigned_user_id: task.assigned_user_id || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
      })
    } else {
      setEditId(null)
      setFormData({
        title: '',
        description: '',
        status: 'new',
        project_id: '',
        owner_id: currentUser?.id || '',
        assigned_user_id: '',
        due_date: '',
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      showToast('Task title is required', 'warning')
      return
    }

    // Clean up form data - convert empty strings to null/undefined for optional fields
    const cleanedData = {
      title: formData.title,
      description: formData.description || null,
      status: formData.status || 'new',
      project_id: formData.project_id ? parseInt(formData.project_id) : null,
      owner_id: formData.owner_id ? parseInt(formData.owner_id) : null,
      assigned_user_id: formData.assigned_user_id ? parseInt(formData.assigned_user_id) : null,
      due_date: formData.due_date || null,
    }

    try {
      if (editId) {
        await dispatch(updateTask({ id: editId, data: cleanedData })).unwrap()
        showToast('Task updated successfully', 'success')
      } else {
        await dispatch(createTask(cleanedData)).unwrap()
        showToast('Task created successfully', 'success')
      }
      setOpen(false)
    } catch (err) {
      // Handle error - convert object to string if needed
      const errorMsg = typeof err === 'string' ? err : (err?.message || 'Operation failed')
      showToast(errorMsg, 'error')
    }
  }

  const handleDelete = (id, title) => {
    showConfirm(
      'Delete Task?',
      `Are you sure you want to delete task "${title}"? This action cannot be undone.`,
      async () => {
        try {
          await dispatch(deleteTask(id)).unwrap()
          showToast('Task deleted successfully', 'success')
        } catch (err) {
          showToast(err || 'Failed to delete task', 'error')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  // Filter tasks
  const filteredTasks = (tasks || []).filter((task) => {
    const search = (searchTerm || '').toLowerCase()
    const matchesSearch =
      (task.title && task.title.toLowerCase().includes(search)) ||
      (task.description &&
        task.description.toLowerCase().includes(search))
    const matchesStatus = !statusFilter || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Pagination
  const paginatedTasks = filteredTasks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success'
      case 'in-progress':
        return 'info'
      case 'blocked':
        return 'error'
      case 'new':
      case 'not started':
        return 'default'
      default:
        return 'default'
    }
  }

  // Extract permissions with proper fallback
  const taskPermissions = permissions?.task || {}
  const canCreate = taskPermissions?.create === true
  const canUpdate = taskPermissions?.update === true
  const canDelete = taskPermissions?.delete === true

  // Debug logging
  console.log('Tasks - Permissions:', { permissions, taskPermissions, canCreate, canUpdate, canDelete })

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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Tasks
        </Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Create Task
          </Button>
        )}
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search tasks..."
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
        <FormControl fullWidth>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="not started">Not Started</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your search'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {tasks.length === 0
              ? 'Create your first task to get started'
              : 'Try adjusting your search or filter criteria'}
          </Typography>
          {tasks.length === 0 && canCreate && (
            <Button variant="contained" onClick={() => handleOpen()}>
              Create First Task
            </Button>
          )}
        </Paper>
      )}

      {/* Table */}
      {filteredTasks.length > 0 && (
        <>
          <Paper sx={{ overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Project</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Owner</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Due Date</TableCell>
                  {(canUpdate || canDelete) && (
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTasks.map((task) => (
                  <TableRow key={task.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{task.title}</TableCell>
                    <TableCell>{task.description || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={task.status?.replace('-', ' ') || 'Unknown'}
                        color={getStatusColor(task.status)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {projects.find((p) => p.id === task.project_id)?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {users && users.find((u) => u.id === task.owner_id)?.username || '-'}
                    </TableCell>
                    <TableCell>
                      {users && users.find((u) => u.id === task.assigned_user_id)?.username || '-'}
                    </TableCell>
                    <TableCell>
                      {task.due_date ? task.due_date.split('T')[0] : '-'}
                    </TableCell>
                    {(canUpdate || canDelete) && (
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpen(task)}
                          disabled={!canUpdate}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          disabled={!canDelete}
                          onClick={() => handleDelete(task.id, task.title)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredTasks.length}
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
          {editId ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            fullWidth
            error={!formData.title && open}
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="not started">Not Started</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Project (Optional)</InputLabel>
            <Select
              value={formData.project_id}
              label="Project (Optional)"
              onChange={(e) =>
                setFormData({ ...formData, project_id: e.target.value })
              }
            >
              <MenuItem value="">None</MenuItem>
              {projects.map((project) => (
                <MenuItem key={project.id} value={project.id}>
                  {project.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Due Date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Assign To (Optional)</InputLabel>
            <Select
              value={formData.assigned_user_id}
              label="Assign To (Optional)"
              onChange={(e) =>
                setFormData({ ...formData, assigned_user_id: e.target.value })
              }
            >
              <MenuItem value="">None</MenuItem>
              {users && users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
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

export default Tasks
