# 📝 Todoist Clone

A modern, feature-rich todo application that replicates the authentic Todoist experience using React, Convex, and Tailwind CSS.

![Todoist Clone Preview](https://img.shields.io/badge/Status-Ready%20for%20Development-brightgreen)
![React](https://img.shields.io/badge/React-18.0-blue)
![Convex](https://img.shields.io/badge/Convex-Real--time-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## ✨ Features

- 🎯 **Authentic Todoist UI** - Pixel-perfect recreation of Todoist's interface
- ⚡ **Real-time Updates** - Instant synchronization across all sessions
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🗂️ **Task Organization** - Collapsible sections, overdue tasks, and completion tracking
- ➕ **Smart Task Creation** - Modal-based task entry with priority and reminders
- ✅ **Complete CRUD Operations** - Add, edit, toggle, and delete tasks
- 🎨 **Modern Styling** - Clean, professional design with Tailwind CSS
- 🔄 **Real-time Sync** - Powered by Convex for instant data updates

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- A Convex account (sign up at https://convex.dev)

### Installation

1. **Install dependencies:**
   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install
   npm install -D @tailwindcss/postcss
   cd ..
   ```

2. **Set up Convex:**
   ```bash
   # Initialize Convex (follow the prompts to login and create a deployment)
   npx convex dev --configure
   ```

3. **Configure environment variables:**
   - After running `convex dev`, copy the deployment URL
   - Update `frontend/.env.local` with your actual Convex URL:
     ```
     VITE_CONVEX_URL=https://your-actual-deployment-url.convex.cloud
     ```

4. **Start the development servers:**

   In one terminal (for Convex backend):
   ```bash
   npx convex dev
   ```

   In another terminal (for React frontend):
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:5173` (or the port shown in the terminal) to see your todo app!

## Project Structure

```
todoist-clone/
├── convex/                 # Convex backend functions
│   ├── schema.ts          # Database schema
│   ├── todos.ts           # Todo CRUD operations
│   └── _generated/        # Generated API types
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # App entry point with Convex provider
│   │   └── index.css      # Tailwind CSS imports
│   └── .env.local         # Environment variables
├── package.json           # Backend dependencies
└── convex.json           # Convex configuration
```

## Technologies Used

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Convex (real-time database and functions)
- **Styling:** Tailwind CSS for modern, responsive design

## Next Steps

To enhance this todo app, you could add:

- User authentication
- Categories/projects for todos
- Due dates and priorities
- Search and filtering
- Dark mode
- Mobile app with React Native

## Contributing

Feel free to fork this project and submit pull requests for any improvements!