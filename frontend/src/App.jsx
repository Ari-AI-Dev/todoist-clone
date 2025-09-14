import { useState, useEffect } from 'react'
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

function App() {
  const [userId] = useState('user-1')
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [isOverdueCollapsed, setIsOverdueCollapsed] = useState(false)

  // New state for additional functionality
  const [priority, setPriority] = useState('none')
  const [dueDate, setDueDate] = useState('')
  const [reminders, setReminders] = useState([])
  const [project, setProject] = useState('Inbox')
  const [showPriorityMenu, setShowPriorityMenu] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showReminderMenu, setShowReminderMenu] = useState(false)
  const [showProjectMenu, setShowProjectMenu] = useState(false)

  const todos = useQuery(api.todos.getTodos, { userId })
  const addTodo = useMutation(api.todos.addTodo)
  const updateTodo = useMutation(api.todos.updateTodo)
  const toggleTodo = useMutation(api.todos.toggleTodo)
  const deleteTodo = useMutation(api.todos.deleteTodo)

  const completedTodos = todos?.filter(todo => todo.isCompleted) || []
  const pendingTodos = todos?.filter(todo => !todo.isCompleted) || []
  const overdueCount = pendingTodos.length

  const handleAddTask = async () => {
    if (taskName.trim()) {
      await addTodo({
        text: taskName,
        userId,
        priority,
        dueDate: dueDate || undefined,
        reminders: reminders.length > 0 ? reminders : undefined,
        project
      })
      // Reset all fields
      setTaskName('')
      setTaskDescription('')
      setPriority('none')
      setDueDate('')
      setReminders([])
      setProject('Inbox')
      setShowAddTask(false)
    }
  }

  const handleCancel = () => {
    setTaskName('')
    setTaskDescription('')
    setPriority('none')
    setDueDate('')
    setReminders([])
    setProject('Inbox')
    setShowAddTask(false)
  }

  // Helper functions for UI interactions
  const getPriorityColor = (priorityLevel) => {
    switch (priorityLevel) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const getPriorityIcon = (priorityLevel) => {
    const colors = {
      high: '#ef4444',
      medium: '#f59e0b',
      low: '#3b82f6',
      none: '#6b7280'
    }
    return colors[priorityLevel] || colors.none
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const setToday = () => {
    const today = new Date().toISOString().split('T')[0]
    setDueDate(today)
    setShowDatePicker(false)
  }

  const setTomorrow = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setDueDate(tomorrow.toISOString().split('T')[0])
    setShowDatePicker(false)
  }

  const clearDueDate = () => {
    setDueDate('')
  }

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.relative')) {
        setShowDatePicker(false)
        setShowPriorityMenu(false)
        setShowReminderMenu(false)
        setShowProjectMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAddTask()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white min-h-screen">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Today</h1>
            <p className="text-sm text-gray-500 flex items-center">
              <span className="w-4 h-4 rounded-full border border-gray-300 mr-2"></span>
              {pendingTodos.length} tasks
            </p>
          </div>

          {/* Overdue Section */}
          {overdueCount > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setIsOverdueCollapsed(!isOverdueCollapsed)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center">
                  <svg
                    className={`w-4 h-4 mr-2 transition-transform ${isOverdueCollapsed ? '-rotate-90' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-gray-900">Overdue</span>
                </div>
                <span className="text-red-500 text-sm font-medium">Reschedule</span>
              </button>

              {!isOverdueCollapsed && (
                <div className="mt-3 space-y-2">
                  {pendingTodos.map((todo) => (
                    <div key={todo._id} className="flex items-start gap-3 py-2 hover:bg-gray-50 rounded px-2">
                      <button
                        onClick={() => toggleTodo({ id: todo._id })}
                        className="w-5 h-5 mt-0.5 rounded-full border-2 border-gray-300 hover:border-gray-400 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900">{todo.text}</div>
                        <div className="flex items-center gap-2 mt-1">
                          {todo.dueDate && (
                            <span className="text-xs text-green-600 flex items-center gap-1">
                              📅 {formatDueDate(todo.dueDate)}
                            </span>
                          )}
                          {todo.priority && todo.priority !== 'none' && (
                            <span className={`text-xs flex items-center gap-1 ${getPriorityColor(todo.priority)}`}>
                              <svg className="w-3 h-3" fill={getPriorityIcon(todo.priority)} viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                              </svg>
                              {todo.priority}
                            </span>
                          )}
                          {todo.reminders && todo.reminders.length > 0 && (
                            <span className="text-xs text-blue-600 flex items-center gap-1">
                              🔔 {todo.reminders.length} reminder{todo.reminders.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">📋 {todo.project || 'Inbox'}</span>
                        <button
                          onClick={() => deleteTodo({ id: todo._id })}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Today Date */}
          <div className="mb-6 border-t pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                weekday: 'long'
              })} • Today • {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
            </h2>
          </div>

          {/* Add Task Button */}
          {!showAddTask && (
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center text-gray-500 hover:text-red-500 text-sm mb-6"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add task
            </button>
          )}

          {/* Add Task Modal */}
          {showAddTask && (
            <div className="fixed inset-0 bg-white bg-opacity-50 flex items-start justify-center pt-20 z-50" onClick={handleCancel}>
              <div
                className="task-card w-[600px] bg-white rounded-[14px] overflow-hidden"
                style={{
                  boxShadow: '0 6px 16px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.06)'
                }}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
              >
                {/* Card Body */}
                <div className="card-body" style={{ padding: '24px 24px 16px' }}>
                  {/* Title Input */}
                  <input
                    type="text"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Task name"
                    className="title w-full border-none outline-none mb-2 focus:shadow-[inset_0_-1px_0_var(--border-muted)]"
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      lineHeight: '1.3',
                      color: 'var(--text-primary)'
                    }}
                    aria-label="Task name"
                    autoFocus
                  />

                  {/* Description Input */}
                  <input
                    type="text"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Description"
                    className="desc w-full border-none outline-none focus:shadow-[inset_0_-1px_0_var(--border-muted)]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      lineHeight: '1.4',
                      color: 'var(--text-description)',
                      marginBottom: '16px'
                    }}
                    aria-label="Description"
                  />

                  {/* Chips Row */}
                  <div className="chip-row flex items-center gap-2 mb-3">
                    {/* Due Date Chip */}
                    <div className="relative">
                      <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className={`chip inline-flex items-center gap-1.5 rounded-full border ${dueDate ? 'chip--today' : ''}`}
                        style={{
                          height: '28px',
                          padding: '0 12px',
                          backgroundColor: dueDate ? 'var(--chip-green-bg)' : 'white',
                          borderColor: 'var(--border-muted)',
                          color: dueDate ? 'var(--chip-green)' : 'var(--text-primary)',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                        aria-label="Set due date"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span>{dueDate ? formatDueDate(dueDate) : 'Today'}</span>
                        {dueDate && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              clearDueDate()
                            }}
                            className="chip-close opacity-70 hover:opacity-100"
                            style={{ fontSize: '12px' }}
                            aria-label="Remove due date"
                          >
                            ×
                          </button>
                        )}
                      </button>

                      {/* Date Picker Dropdown */}
                      {showDatePicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
                          <button
                            onClick={setToday}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                          >
                            <span className="text-green-600 mr-2">📅</span>
                            Today
                          </button>
                          <button
                            onClick={setTomorrow}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm"
                          >
                            <span className="text-orange-500 mr-2">📅</span>
                            Tomorrow
                          </button>
                          <div className="border-t my-1"></div>
                          <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full px-3 py-2 border rounded text-sm"
                          />
                        </div>
                      )}
                    </div>

                    {/* Priority Chip */}
                    <div className="relative">
                      <button
                        onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                        className="chip inline-flex items-center gap-1.5 rounded-full border bg-white hover:bg-gray-50"
                        style={{
                          height: '28px',
                          padding: '0 12px',
                          borderColor: 'var(--border-muted)',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                        aria-label="Set priority"
                      >
                        <svg className="w-3.5 h-3.5" fill={getPriorityIcon(priority)} viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                        </svg>
                        <span className={getPriorityColor(priority)} style={{ color: 'var(--text-primary)' }}>
                          Priority {priority !== 'none' ? priority : ''}
                        </span>
                      </button>

                      {/* Priority Menu */}
                      {showPriorityMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-1 z-10 min-w-[150px]">
                          <button
                            onClick={() => { setPriority('high'); setShowPriorityMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5" fill="#ef4444" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            High Priority
                          </button>
                          <button
                            onClick={() => { setPriority('medium'); setShowPriorityMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5" fill="#f59e0b" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            Medium Priority
                          </button>
                          <button
                            onClick={() => { setPriority('low'); setShowPriorityMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5" fill="#3b82f6" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                            </svg>
                            Low Priority
                          </button>
                          <div className="border-t my-1"></div>
                          <button
                            onClick={() => { setPriority('none'); setShowPriorityMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-500"
                          >
                            Remove Priority
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Reminders Chip */}
                    <div className="relative">
                      <button
                        onClick={() => setShowReminderMenu(!showReminderMenu)}
                        className="chip inline-flex items-center gap-1.5 rounded-full border bg-white hover:bg-gray-50"
                        style={{
                          height: '28px',
                          padding: '0 12px',
                          borderColor: 'var(--border-muted)',
                          color: reminders.length > 0 ? 'var(--chip-green)' : 'var(--icon-muted)',
                          backgroundColor: reminders.length > 0 ? 'var(--chip-green-bg)' : 'white',
                          fontSize: '13px',
                          fontWeight: '500'
                        }}
                        aria-label="Add reminder"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span style={{ color: 'var(--text-primary)' }}>
                          Reminders {reminders.length > 0 ? `(${reminders.length})` : ''}
                        </span>
                        {reminders.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setReminders([])
                            }}
                            className="chip-close opacity-70 hover:opacity-100"
                            style={{ fontSize: '12px' }}
                            aria-label="Remove reminders"
                          >
                            ×
                          </button>
                        )}
                      </button>

                      {/* Reminder Menu */}
                      {showReminderMenu && (
                        <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-10 min-w-[250px]">
                          <div className="mb-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Add Reminder</label>
                            <input
                              type="datetime-local"
                              className="w-full px-3 py-2 border rounded text-sm"
                              onChange={(e) => {
                                if (e.target.value) {
                                  const newReminder = {
                                    datetime: e.target.value,
                                    type: 'notification'
                                  }
                                  setReminders([...reminders, newReminder])
                                  e.target.value = ''
                                }
                              }}
                            />
                          </div>

                          {reminders.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs font-medium text-gray-700 mb-1">Current Reminders:</div>
                              {reminders.map((reminder, index) => (
                                <div key={index} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded text-xs mb-1">
                                  <span>{new Date(reminder.datetime).toLocaleString()}</span>
                                  <button
                                    onClick={() => {
                                      setReminders(reminders.filter((_, i) => i !== index))
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <button
                            onClick={() => setShowReminderMenu(false)}
                            className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Kebab Menu */}
                    <button
                      className="kebab flex items-center justify-center hover:bg-gray-50"
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '8px',
                        color: 'var(--icon-muted)'
                      }}
                      aria-label="More options"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>

                  {/* Divider */}
                  <hr
                    className="divider border-0 mb-3"
                    style={{
                      height: '1px',
                      backgroundColor: 'var(--border-muted)'
                    }}
                  />

                  {/* Footer */}
                  <div className="footer flex items-center justify-between">
                    {/* Project/Inbox Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowProjectMenu(!showProjectMenu)}
                        className="dropdown inline-flex items-center gap-1.5 hover:bg-gray-50 rounded"
                        style={{
                          height: '28px',
                          padding: '0 8px',
                          color: 'var(--icon-muted)',
                          fontSize: '13px'
                        }}
                        aria-haspopup="listbox"
                        aria-expanded={showProjectMenu}
                        aria-label="Project"
                      >
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span style={{ color: 'var(--text-primary)' }}>{project}</span>
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {/* Project Menu */}
                      {showProjectMenu && (
                        <div className="absolute bottom-full left-0 mb-1 bg-white border rounded-lg shadow-lg p-1 z-10 min-w-[150px]">
                          <button
                            onClick={() => { setProject('Inbox'); setShowProjectMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            Inbox
                          </button>
                          <button
                            onClick={() => { setProject('Work'); setShowProjectMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            Work
                          </button>
                          <button
                            onClick={() => { setProject('Personal'); setShowProjectMenu(false); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm flex items-center gap-2"
                          >
                            <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Personal
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="actions flex items-center gap-3">
                      <button
                        onClick={handleCancel}
                        className="btn btn-ghost rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                          backgroundColor: 'var(--button-ghost-bg)',
                          color: 'var(--button-ghost-text)',
                          padding: '8px 12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          focusRingColor: 'var(--focus-ring)'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddTask}
                        className="btn btn-primary rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 hover:opacity-90"
                        style={{
                          backgroundColor: 'var(--button-primary-bg)',
                          color: 'var(--button-primary-text)',
                          padding: '8px 14px',
                          fontSize: '14px',
                          fontWeight: '600',
                          boxShadow: '0 1px 0 rgba(0,0,0,0.05)',
                          focusRingColor: 'var(--focus-ring)'
                        }}
                      >
                        Add task
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTodos.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm text-gray-500 mb-3">Completed ({completedTodos.length})</h3>
              <div className="space-y-2">
                {completedTodos.map((todo) => (
                  <div key={todo._id} className="flex items-center gap-3 py-2 opacity-60">
                    <button
                      onClick={() => toggleTodo({ id: todo._id })}
                      className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                    >
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="text-gray-500 line-through">{todo.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App