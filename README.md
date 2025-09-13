# Todoist Clone

A modern todo application built with React, Convex, and Tailwind CSS.

## Features

- ✅ Add new todos
- ✅ Mark todos as complete/incomplete
- ✅ Delete todos
- ✅ Real-time updates with Convex
- ✅ Beautiful UI with Tailwind CSS

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