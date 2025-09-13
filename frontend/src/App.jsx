import { useState } from 'react'
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

function App() {
  const [userId] = useState('user-1')
  const [showAddTask, setShowAddTask] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [isOverdueCollapsed, setIsOverdueCollapsed] = useState(false)

  const todos = useQuery(api.todos.getTodos, { userId })
  const addTodo = useMutation(api.todos.addTodo)
  const toggleTodo = useMutation(api.todos.toggleTodo)
  const deleteTodo = useMutation(api.todos.deleteTodo)

  const completedTodos = todos?.filter(todo => todo.isCompleted) || []
  const pendingTodos = todos?.filter(todo => !todo.isCompleted) || []
  const overdueCount = pendingTodos.length

  const handleAddTask = async () => {
    if (taskName.trim()) {
      await addTodo({ text: taskName, userId })
      setTaskName('')
      setTaskDescription('')
      setShowAddTask(false)
    }
  }

  const handleCancel = () => {
    setTaskName('')
    setTaskDescription('')
    setShowAddTask(false)
  }

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
                        <div className="text-xs text-gray-500 mt-1">
                          📅 15 Jan
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">📚 Education</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">📋 Routines</span>
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
                    {/* Today Chip (Selected) */}
                    <button
                      className="chip chip--today inline-flex items-center gap-1.5 rounded-full border"
                      style={{
                        height: '28px',
                        padding: '0 12px',
                        backgroundColor: 'var(--chip-green-bg)',
                        borderColor: 'var(--border-muted)',
                        color: 'var(--chip-green)',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                      aria-label="Due date: Today. Click to change"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>Today</span>
                      <button
                        className="chip-close opacity-70 hover:opacity-100"
                        style={{ fontSize: '12px' }}
                        aria-label="Remove due date"
                      >
                        ×
                      </button>
                    </button>

                    {/* Priority Chip */}
                    <button
                      className="chip inline-flex items-center gap-1.5 rounded-full border bg-white hover:bg-gray-50"
                      style={{
                        height: '28px',
                        padding: '0 12px',
                        borderColor: 'var(--border-muted)',
                        color: 'var(--icon-muted)',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                      aria-label="Set priority"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                      </svg>
                      <span style={{ color: 'var(--text-primary)' }}>Priority</span>
                    </button>

                    {/* Reminders Chip */}
                    <button
                      className="chip inline-flex items-center gap-1.5 rounded-full border bg-white hover:bg-gray-50"
                      style={{
                        height: '28px',
                        padding: '0 12px',
                        borderColor: 'var(--border-muted)',
                        color: 'var(--icon-muted)',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                      aria-label="Add reminder"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      <span style={{ color: 'var(--text-primary)' }}>Reminders</span>
                    </button>

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
                    {/* Inbox Dropdown */}
                    <button
                      className="dropdown inline-flex items-center gap-1.5 hover:bg-gray-50 rounded"
                      style={{
                        height: '28px',
                        padding: '0 8px',
                        color: 'var(--icon-muted)',
                        fontSize: '13px'
                      }}
                      aria-haspopup="listbox"
                      aria-expanded="false"
                      aria-label="Project"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span style={{ color: 'var(--text-primary)' }}>Inbox</span>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

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
