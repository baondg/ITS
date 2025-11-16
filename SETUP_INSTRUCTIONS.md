# Setup Instructions - Intelligent Tutoring System (ITS)

## System Requirements

### Prerequisites
- **Java 17 or higher**
- **Node.js 16 or higher**
- **MongoDB 4.4 or higher** 
- **Maven 3.6 or higher**
- **Git** (for cloning)

### Optional Tools
- **MongoDB Compass** (GUI for MongoDB)
- **Postman** (for API testing)
- **VS Code** or **IntelliJ IDEA** (development)

---

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ITS
```

### 2. MongoDB Setup

#### Option A: Local MongoDB Installation
1. **Download and install MongoDB** from [mongodb.com](https://www.mongodb.com/try/download/community)

2. **Start MongoDB service**
   ```bash
   # Windows (if installed as service)
   net start MongoDB
   
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux (systemd)
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running**
   ```bash
   mongo --eval "db.runCommand({connectionStatus : 1})"
   ```

#### Option B: MongoDB Docker (Alternative)
```bash
# Run MongoDB in Docker container
docker run -d -p 27017:27017 --name mongodb mongo:4.4

# Verify container is running
docker ps
```

### 3. Backend Setup (Spring Boot)

1. **Navigate to backend directory**
   ```bash
   cd its-backend
   ```

2. **Configure application properties** (Optional)
   
   Edit `src/main/resources/application.properties`:
   ```properties
   # MongoDB Configuration
   spring.data.mongodb.host=localhost
   spring.data.mongodb.port=27017
   spring.data.mongodb.database=its_database
   
   # JWT Configuration (Change for production)
   jwt.secret=mySecretKey12345678901234567890123456789012345678901234567890
   jwt.expiration=86400
   
   # File Upload Directory
   file.upload-dir=./uploads
   
   # Server Configuration
   server.port=8080
   ```

3. **Install dependencies and run**
   ```bash
   # Install dependencies
   mvn clean install
   
   # Run the application
   mvn spring-boot:run
   ```

4. **Verify backend is running**
   - Open browser and go to: `http://localhost:8080/api/content/categories`
   - Should return: `["TEXT","VIDEO","INTERACTIVE_EXERCISE"]`

### 4. Frontend Setup (React)

1. **Open new terminal and navigate to frontend**
   ```bash
   cd its-frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Verify frontend is running**
   - Browser should automatically open: `http://localhost:3000`
   - You should see the ITS login page

---

## Configuration Options

### Backend Configuration

#### Database Configuration
```properties
# MongoDB Settings
spring.data.mongodb.host=localhost
spring.data.mongodb.port=27017
spring.data.mongodb.database=its_database
spring.data.mongodb.auto-index-creation=true
```

#### Security Configuration
```properties
# JWT Settings
jwt.secret=your-secret-key-minimum-256-bits
jwt.expiration=86400  # 24 hours in seconds

# CORS Settings
cors.allowed-origins=http://localhost:3000
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
```

#### File Upload Configuration
```properties
# File Upload Settings
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
file.upload-dir=./uploads
```

### Frontend Configuration

#### Environment Variables
Create `.env` file in `its-frontend` directory:
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_FILE_UPLOAD_MAX_SIZE=10485760
```

#### API Base URL
Edit `src/services/httpClient.js` if needed:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

---

## Testing the Application

### 1. Initial User Registration

1. **Open the application**
   - Go to `http://localhost:3000`

2. **Register as an Instructor**
   - Click "Register here"
   - Fill form with:
     - Email: `instructor@test.com`
     - Password: `password123`
     - Role: `Instructor`
     - First Name: `John`
     - Last Name: `Doe`
   - Click "Register"

3. **Register as a Student**
   - Logout and register another user:
     - Email: `student@test.com`  
     - Password: `password123`
     - Role: `Student`
     - First Name: `Jane`
     - Last Name: `Smith`

### 2. Content Management Testing

1. **Login as Instructor** (`instructor@test.com`)

2. **Create Text Content**
   - Click "Create New Content"
   - Title: "Introduction to Programming"
   - Type: "Text"
   - Content: "Programming is the process of creating instructions..."
   - Check "Publish immediately"
   - Click "Create"

3. **Create Video Content**
   - Click "Create New Content"  
   - Title: "Programming Tutorial Video"
   - Type: "Video"
   - Upload a video file
   - Click "Create"

4. **Test Search**
   - Use search box to find "Programming"
   - Verify results appear

### 3. Role-Based Access Testing

1. **Login as Student** (`student@test.com`)
   - Verify you can view content but cannot create/edit
   - "Create New Content" button should not appear

2. **Login as Instructor**
   - Verify you can create, edit, and delete your own content
   - Cannot edit content created by other instructors

---

## Troubleshooting

### Common Backend Issues

#### MongoDB Connection Error
```
Error: com.mongodb.MongoSocketOpenException: Exception opening socket
```
**Solution:**
1. Verify MongoDB is running: `mongosh` or `mongo`
2. Check if port 27017 is available: `netstat -an | findstr 27017`
3. Restart MongoDB service

#### Port Already in Use (8080)
```
Error: Web server failed to start. Port 8080 was already in use.
```
**Solution:**
1. Find process using port: `netstat -ano | findstr 8080`
2. Kill process: `taskkill /PID <process_id> /F`
3. Or change port in `application.properties`: `server.port=8081`

#### JWT Secret Key Error
```
Error: JWT secret key must be at least 256 bits
```
**Solution:**
1. Generate a longer secret key (minimum 32 characters)
2. Update `jwt.secret` in `application.properties`

### Common Frontend Issues

#### Module Not Found Error
```
Error: Cannot resolve module 'react-router-dom'
```
**Solution:**
```bash
cd its-frontend
npm install
```

#### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
1. Verify backend CORS configuration
2. Check if backend is running on correct port
3. Verify frontend API URL configuration

#### Network Error
```
Error: Network Error (connecting to backend)
```
**Solution:**
1. Verify backend is running: `http://localhost:8080/api/content/categories`
2. Check firewall settings
3. Verify API URL in frontend configuration

---

## Development Setup

### Backend Development

1. **IDE Setup (IntelliJ IDEA)**
   - Open `its-backend` folder
   - Wait for Maven to sync dependencies
   - Right-click `ItsBackendApplication.java` → Run

2. **Enable Hot Reload**
   Add to `pom.xml`:
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-devtools</artifactId>
       <scope>runtime</scope>
   </dependency>
   ```

### Frontend Development

1. **VS Code Setup**
   - Install extensions:
     - ES7+ React/Redux/React-Native snippets
     - Prettier - Code formatter
     - Auto Rename Tag

2. **Enable Hot Reload** (Already configured)
   ```bash
   npm start  # Automatically reloads on file changes
   ```

---

## Production Deployment

### Backend Deployment

1. **Build JAR file**
   ```bash
   cd its-backend
   mvn clean package -DskipTests
   ```

2. **Configure production properties**
   Create `application-prod.properties`:
   ```properties
   spring.data.mongodb.uri=mongodb://your-prod-db:27017/its_database
   jwt.secret=your-production-secret-key-256-bits-minimum
   cors.allowed-origins=https://your-frontend-domain.com
   ```

3. **Run in production**
   ```bash
   java -jar target/its-backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
   ```

### Frontend Deployment

1. **Build production files**
   ```bash
   cd its-frontend
   npm run build
   ```

2. **Serve static files**
   ```bash
   # Using serve package
   npx serve -s build -l 3000
   
   # Or use nginx, Apache, etc.
   ```

---

## Additional Configuration

### MongoDB Indexes (For Performance)

Connect to MongoDB and run:
```javascript
use its_database;

// User indexes
db.users.createIndex({ "email": 1 }, { unique: true });

// Content indexes  
db.learning_materials.createIndex({ "title": "text" });
db.learning_materials.createIndex({ "topicId": 1 });
db.learning_materials.createIndex({ "createdBy": 1 });
db.learning_materials.createIndex({ "published": 1 });

// Course indexes
db.courses.createIndex({ "title": "text" });
db.courses.createIndex({ "createdBy": 1 });
```

### File Upload Directory
```bash
# Create upload directory
mkdir -p uploads
chmod 755 uploads
```

### Logging Configuration

Add to `application.properties`:
```properties
# Logging levels
logging.level.com.its=INFO
logging.level.org.springframework.security=DEBUG
logging.file.name=logs/its-application.log
```

This completes the setup instructions for the Intelligent Tutoring System. The application should now be running successfully with both authentication and content management features working.