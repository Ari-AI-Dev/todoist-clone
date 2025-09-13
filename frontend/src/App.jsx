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
            <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white shadow-sm">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task name"
                className="w-full text-sm font-medium border-none outline-none mb-2"
                autoFocus
              />
              <input
                type="text"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Description"
                className="w-full text-xs text-gray-500 border-none outline-none mb-4"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="flex items-center text-xs text-gray-600 bg-green-50 border border-green-200 rounded px-2 py-1">
                    📅 Today
                    <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="flex items-center text-xs text-gray-600 border border-gray-200 rounded px-2 py-1">
                    🏷️ Priority
                  </button>
                  <button className="flex items-center text-xs text-gray-600 border border-gray-200 rounded px-2 py-1">
                    🔔 Reminders
                  </button>
                  <button className="text-gray-400 p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-xs text-gray-600 border border-gray-200 rounded px-2 py-1">
                    📥 Inbox
                    <svg className="w-3 h-3 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-sm text-gray-600 px-3 py-1 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddTask}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Add task
                  </button>
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
