import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../store/projectsSlice'
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
} from '@mui/material'
import { Edit, Delete, Search, FolderOpen, Add } from '@mui/icons-material'
import { useToast } from '../context/ToastContext'
import { useConfirmation } from '../context/ConfirmationContext'

const Projects = () => {
  const dispatch = useDispatch()
  const { showToast } = useToast()
  const { showConfirm } = useConfirmation()
  const { items: projects, status, error } = useSelector((state) => state.projects)
  const { permissions } = useSelector((state) => state.permissions)
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProjects())
    }
  }, [status, dispatch])

  // Show errors as toasts
  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  const handleOpen = (project = null) => {
    if (project) {
      setEditId(project.id)
      setFormData({
        name: project.name,
        description: project.description || '',
        start_date: extractDate(project.start_date) || '',
        end_date: extractDate(project.end_date) || '',
      })
    } else {
      setEditId(null)
      setFormData({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
      })
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      showToast('Project name is required', 'warning')
      return
    }

    try {
      if (editId) {
        await dispatch(updateProject({ id: editId, data: formData })).unwrap()
        showToast('Project updated successfully', 'success')
      } else {
        await dispatch(createProject(formData)).unwrap()
        showToast('Project created successfully', 'success')
      }
      setOpen(false)
    } catch (err) {
      showToast(err || 'Operation failed', 'error')
    }
  }

  const handleDelete = (id, name) => {
    showConfirm(
      'Delete Project?',
      `Are you sure you want to delete project "${name}"? This action cannot be undone.`,
      async () => {
        try {
          await dispatch(deleteProject(id)).unwrap()
          showToast('Project deleted successfully', 'success')
        } catch (err) {
          showToast(err || 'Failed to delete project', 'error')
        }
      },
      'Delete',
      'Cancel'
    )
  }

  // Extract date part from datetime string
  const extractDate = (dateString) => {
    if (!dateString) return ''
    return dateString.split('T')[0]
  }

  // Filter projects by search term
  const filteredProjects = (projects || []).filter(
    (project) => {
      const search = (searchTerm || '').toLowerCase()
      return (
        project.name.toLowerCase().includes(search) ||
        (project.description && project.description.toLowerCase().includes(search))
      )
    }
  )

  // Pagination
  const paginatedProjects = filteredProjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // Extract permissions with proper fallback
  const projectPermissions = permissions?.project || {}
  const canCreate = projectPermissions?.create === true
  const canUpdate = projectPermissions?.update === true
  const canDelete = projectPermissions?.delete === true

  // Debug logging
  console.log('Projects - Permissions:', { permissions, projectPermissions, canCreate, canUpdate, canDelete })

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
          Projects
        </Typography>
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Create Project
          </Button>
        )}
      </Box>

      {/* Search */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search projects..."
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
      {filteredProjects.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FolderOpen sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            {projects.length === 0 ? 'No projects yet' : 'No projects match your search'}
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            {projects.length === 0
              ? 'Create your first project to get started'
              : 'Try adjusting your search criteria'}
          </Typography>
          {projects.length === 0 && canCreate && (
            <Button variant="contained" onClick={() => handleOpen()}>
              Create First Project
            </Button>
          )}
        </Paper>
      )}

      {/* Table */}
      {filteredProjects.length > 0 && (
        <>
          <Paper sx={{ overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                  {(canUpdate || canDelete) && (
                    <TableCell sx={{ fontWeight: 700, textAlign: 'right' }}>
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedProjects.map((project) => (
                  <TableRow key={project.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{project.name}</TableCell>
                    <TableCell>{project.description || '-'}</TableCell>
                    <TableCell>{extractDate(project.start_date) || '-'}</TableCell>
                    <TableCell>{extractDate(project.end_date) || '-'}</TableCell>
                    {(canUpdate || canDelete) && (
                      <TableCell sx={{ textAlign: 'right' }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleOpen(project)}
                          disabled={!canUpdate}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(project.id, project.name)}
                          disabled={!canDelete}
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
              count={filteredProjects.length}
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
          {editId ? 'Edit Project' : 'Create New Project'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            error={!formData.name && open}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Start Date"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End Date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
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

export default Projects
