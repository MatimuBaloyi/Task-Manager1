## Features
- Add, view, and complete tasks
- Task priorities (High, Medium, Low)
- Real-time task list updates
- Modern, responsive UI

## Project Structure

```
Task-Manager1/
├── backend/
│   └── TaskManager.Api/         # ASP.NET Core Web API
│       ├── Controllers/
│       ├── Models/
│       ├── Services/
│       └── ...
└── frontend/
	├── proxy.conf.json          # Angular proxy config
	└── task-manager-ui/         # Angular app
		├── src/app/
		└── ...
```

## Prerequisites
- Node.js (LTS recommended)
- .NET 9 SDK
- Angular CLI

## Getting Started

### 1. Start the Backend
```sh
cd backend/TaskManager.Api
# Run with HTTP (recommended for local dev)
dotnet run --launch-profile http
```
The backend will be available at http://localhost:5210

### 2. Start the Frontend
```sh
cd frontend/task-manager-ui
npm install
ng serve --proxy-config ../proxy.conf.json
```
The frontend will be available at http://localhost:4200

## API Endpoints
- `GET /tasks` - Get all tasks
- `POST /tasks` - Add a new task
- `PUT /tasks/{id}` - Mark a task as completed

## Troubleshooting
- Make sure the backend is running on the same port as specified in `proxy.conf.json` (default: 5210)
- Always use `/tasks` (not a full URL) in frontend API calls
- If you see CORS or 404 errors, check that both servers are running and the proxy config is correct

## License
MIT