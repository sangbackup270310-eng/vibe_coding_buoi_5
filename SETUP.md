# Setup Guide - Try-on Project

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Supabase account (for database and storage)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/sangbackup270310-eng/vibe_coding_buoi_5.git
cd vibe_coding_buoi_5
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NODE_ENV=development
```

Run the backend:

```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3001
```

Run the frontend:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Project Structure

```
buoi_5/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── jwt.js          # JWT configuration
│   │   ├── middleware/
│   │   │   └── auth.js          # Authentication middleware
│   │   └── server.js            # Express server entry point
│   ├── .eslintrc.json           # ESLint configuration
│   ├── .prettierrc.json         # Prettier configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js           # API client configuration
│   │   ├── App.jsx              # Main App component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css           # Global styles
│   ├── .eslintrc.cjs            # ESLint configuration
│   ├── .prettierrc.json         # Prettier configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── vite.config.js           # Vite configuration
│   └── package.json
├── sprints/                     # Sprint planning documents
├── .cursor/                      # Cursor IDE rules and commands
├── PB.md                        # Product Backlog
└── README.md                    # Project documentation
```

## Available Scripts

### Backend

- `npm run dev` - Start development server with watch mode
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Database & Storage**: Supabase
- **Authentication**: JWT
- **Code Quality**: ESLint + Prettier

## Next Steps

1. Set up Supabase project and configure environment variables
2. Complete Task 3: Database Design
3. Complete Task 4: Flow Design
4. Start implementing authentication features (Tasks 5-7)

## Troubleshooting

### Port Already in Use

If port 3000 or 3001 is already in use, you can change them in:
- Backend: `backend/.env` (PORT variable)
- Frontend: `frontend/vite.config.js` (server.port)

### Module Not Found Errors

Make sure you've run `npm install` in both `backend` and `frontend` directories.

### CORS Errors

Ensure the backend CORS is configured correctly in `backend/src/server.js` and the frontend API URL matches in `frontend/.env`.
