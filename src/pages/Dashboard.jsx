import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Divider,
} from '@mui/material'
import {
  Assignment,
  CheckCircle,
  PendingActions,
  FolderOpen,
  PeopleAlt,
  TrendingUp,
} from '@mui/icons-material'
import { fetchProjects } from '../store/projectsSlice'
import { fetchTasks } from '../store/tasksSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, role } = useSelector((state) => state.auth)
  const { items: projects, status: projectsStatus } = useSelector(
    (state) => state.projects
  )
  const { items: tasks, status: tasksStatus } = useSelector((state) => state.tasks)

  useEffect(() => {
    if (projectsStatus === 'idle') {
      dispatch(fetchProjects())
    }
    if (tasksStatus === 'idle') {
      dispatch(fetchTasks())
    }
  }, [dispatch, projectsStatus, tasksStatus])

  const loading = projectsStatus === 'loading' || tasksStatus === 'loading'
  const tasksCompleted = tasks.filter((t) => t.status === 'completed').length
  const tasksInProgress = tasks.filter((t) => t.status === 'in-progress').length
  const tasksPending = tasks.filter(
    (t) => t.status === 'new' || t.status === 'not started'
  ).length

  const StatCard = ({ icon: Icon, label, value, color, action }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        cursor: action ? 'pointer' : 'default',
      }}
      onClick={action}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Icon sx={{ color, fontSize: 32, mr: 1 }} />
          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {loading && <LinearProgress />}

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.username}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {role === 'admin'
            ? 'You have full access to all features'
            : role === 'task_creator'
            ? 'You can create and manage tasks and projects'
            : 'You can view tasks and projects'}
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={FolderOpen}
            label="Projects"
            value={projects.length}
            color="#667eea"
            action={() => navigate('/projects')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={Assignment}
            label="Total Tasks"
            value={tasks.length}
            color="#764ba2"
            action={() => navigate('/tasks')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={tasksCompleted}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={PendingActions}
            label="In Progress"
            value={tasksInProgress}
            color="#ff9800"
          />
        </Grid>
      </Grid>

      {/* Task Overview */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Task Status Overview
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Completed</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tasksCompleted}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(tasksCompleted / tasks.length) * 100 || 0}
                sx={{ height: 8, borderRadius: 4, backgroundColor: '#e0e0e0' }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">In Progress</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tasksInProgress}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(tasksInProgress / tasks.length) * 100 || 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' },
                }}
              />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Pending</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {tasksPending}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(tasksPending / tasks.length) * 100 || 0}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': { backgroundColor: '#f44336' },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {role !== 'read_only' && (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Assignment />}
                    onClick={() => navigate('/tasks')}
                  >
                    Create New Task
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<FolderOpen />}
                    onClick={() => navigate('/projects')}
                  >
                    Create New Project
                  </Button>
                </>
              )}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Assignment />}
                onClick={() => navigate('/tasks')}
              >
                View All Tasks
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FolderOpen />}
                onClick={() => navigate('/projects')}
              >
                View All Projects
              </Button>
              {role === 'admin' && (
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PeopleAlt />}
                  onClick={() => navigate('/users')}
                >
                  Manage Users
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Info Card */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
        <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
          <TrendingUp sx={{ color: '#667eea', mt: 0.5 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Project Completion Rate
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {tasks.length > 0
                ? `You've completed ${Math.round(
                    (tasksCompleted / tasks.length) * 100
                  )}% of your tasks.`
                : 'No tasks yet. Create one to get started!'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Dashboard
