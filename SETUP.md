# Manual Setup Instructions

Since the Convex CLI requires interactive login, please follow these steps manually:

## 1. Navigate to the project directory
```bash
cd /Users/ari/Desktop/Development/todoist-clone
```

## 2. Initialize Convex (Interactive)
```bash
npx convex dev --configure
```

This will prompt you to:
- Login to your Convex account (or create one)
- Create a new project or select existing one
- Choose a deployment name

## 3. After Convex is configured
The command will generate a `.env.local` file with your deployment URL. Copy this URL to the frontend:

```bash
# Copy the CONVEX_URL from the generated .env.local
cp .env.local frontend/.env.local
```

## 4. Start the development servers

Terminal 1 (Backend):
```bash
npx convex dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

## 5. Open your browser
Navigate to `http://localhost:5173` to see your todo app!

## Troubleshooting

If you encounter any issues:
1. Make sure you're in the `/Users/ari/Desktop/Development/todoist-clone` directory
2. Ensure you have a Convex account at https://convex.dev
3. Check that both development servers are running
4. Verify the CONVEX_URL is correctly set in `frontend/.env.local`

## Project is Ready!

All the code is complete and ready to run. The only step needed is the Convex configuration which requires manual interaction.