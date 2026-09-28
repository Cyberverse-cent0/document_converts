# Document Converter

A secure document conversion application with PDF to Word and Word to PDF conversion, featuring authentication, rate limiting, file scanning, and server-side encryption.

## Features

- **Document Conversion**: PDF to Word and Word to PDF conversion
- **Authentication**: JWT-based user authentication with registration and login
- **Rate Limiting**: User quota system to prevent abuse
- **File Scanning**: Malware detection with ClamAV integration
- **Server-Side Encryption**: AES-256 encryption for stored files
- **Modern UI**: React frontend with Tailwind CSS and dark mode support
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

### Backend (Go)
- RESTful API with Go
- PostgreSQL database for user and job persistence
- JWT authentication with bcrypt password hashing
- Rate limiting middleware
- File validation and malware scanning
- AES-256 encryption for file storage
- LibreOffice integration for real document conversion

### Frontend (React)
- React with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API communication
- Context API for state management
- Dark mode support

## Prerequisites

- Go 1.27+
- Node.js 18+
- PostgreSQL 12+
- (Optional) LibreOffice for real document conversion
- (Optional) ClamAV for malware scanning

## Installation

### Backend Setup

1. Clone the repository:
```bash
cd backend
```

2. Install dependencies:
```bash
go mod download
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up PostgreSQL database:
```bash
createdb document_converter
```

5. Run the server:
```bash
go run main.go
```

The backend will start on the configured port (default: 5280).

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontent
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

The frontend will start on http://localhost:3000

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | Server port | `5280` |
| `SERVER_HOST` | Server host | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | `postgres://localhost:5432/document_converter?sslmode=disable` |
| `MIGRATIONS_DIR` | Database migrations directory | `./internal/db/migrations` |
| `JWT_SECRET` | JWT signing secret | `document-converter-dev-secret` |
| `JWT_EXPIRATION` | JWT token expiration | `24h` |
| `ENCRYPTION_KEY` | AES-256 encryption key (min 32 chars) | `document-converter-encryption-key-32-chars` |
| `MAX_FILE_SIZE` | Maximum file size in bytes | `52428800` (50MB) |
| `TEMP_DIR` | Temporary directory for file processing | `/tmp/document-converter` |
| `DEFAULT_DAILY_LIMIT` | Default daily conversion limit per user | `10` |
| `CLAMAV_HOST` | ClamAV daemon host | `localhost` |
| `CLAMAV_PORT` | ClamAV daemon port | `3310` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:3000,http://localhost:5173` |
| `LOG_LEVEL` | Logging level | `info` |

### Frontend Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5280` |
| `VITE_API_TIMEOUT` | API request timeout in ms | `30000` |
| `VITE_APP_NAME` | Application name | `Document Converter` |
| `VITE_APP_VERSION` | Application version | `1.0.0` |
| `VITE_ENABLE_RATE_LIMITING` | Enable rate limiting feature | `true` |
| `VITE_ENABLE_FILE_SCANNING` | Enable file scanning feature | `true` |
| `VITE_ENABLE_ENCRYPTION` | Enable encryption feature | `true` |
| `VITE_MAX_FILE_SIZE` | Maximum file size in bytes | `52428800` (50MB) |
| `VITE_CHUNK_SIZE` | File upload chunk size in bytes | `1048576` (1MB) |
| `VITE_DEFAULT_THEME` | Default theme (light/dark) | `light` |
| `VITE_THEME_PERSISTENCE` | Persist theme preference | `true` |

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Document Conversion
- `POST /api/convert` - Convert document (requires authentication)
- `GET /api/download/{jobId}` - Download converted file
- `GET /api/jobs` - List all conversion jobs

### Security
- `GET /api/user/quota` - Get user's rate limit quota
- `POST /api/files/scan` - Scan uploaded file

## Development

### Backend Development
```bash
cd backend
go run main.go
```

### Frontend Development
```bash
cd frontent
npm run dev
```

### Building for Production

#### Backend
```bash
cd backend
go build -o server
```

#### Frontend
```bash
cd frontent
npm run build
```

## Docker Deployment (Optional)

Create a `docker-compose.yml` file for easy deployment:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: document_converter
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "5280:5280"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/document_converter?sslmode=disable

  frontend:
    build: ./frontent
    ports:
      - "3000:80"
    depends_on:
      - backend
```

## Security Considerations

- Change default JWT secret and encryption keys in production
- Use strong passwords for PostgreSQL
- Enable SSL/TLS for database connections in production
- Configure proper CORS origins for production
- Use HTTPS for API communication in production
- Regularly update dependencies for security patches

## License

MIT License

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
