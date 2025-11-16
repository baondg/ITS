# Intelligent Tutoring System (ITS) - Authentication & Learning Content Management

## Project Overview

This is an 80%-complete web-based Intelligent Tutoring System focusing on **Authentication** and **Learning Content Management** modules. Built using modern technologies and following **SOLID principles** with **layered architecture**.

## Technology Stack

### Backend
- **Spring Boot 3.2.0** - Main framework
- **Spring Security** - Authentication & authorization
- **Spring Data MongoDB** - Database access
- **MongoDB** - NoSQL database
- **JWT** - Token-based authentication
- **Maven** - Dependency management

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **CSS Modules** - Styling

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│      (React Components)             │
├─────────────────────────────────────┤
│        Application Layer            │
│      (REST Controllers)             │
├─────────────────────────────────────┤
│         Business Layer              │
│    (Services & Interfaces)          │
├─────────────────────────────────────┤
│        Persistence Layer            │
│    (MongoDB Repositories)           │
├─────────────────────────────────────┤
│         Domain Layer                │
│    (Entities & DTOs)                │
└─────────────────────────────────────┘
```

### SOLID Principles Implementation

1. **Single Responsibility Principle (SRP)**
   - Each service class handles one specific domain (AuthenticationService, ContentManagementService)
   - Separate DTOs for different operations
   - Focused repository interfaces

2. **Open/Closed Principle (OCP)**
   - ContentType enum extensible for new content types
   - Service interfaces allow for different implementations

3. **Liskov Substitution Principle (LSP)**
   - UserRole enum - any role can be substituted without breaking functionality
   - Interface implementations are interchangeable

4. **Interface Segregation Principle (ISP)**
   - Separate interfaces for different concerns (IAuthenticationService, IContentManagementService)
   - Repository interfaces contain only relevant methods

5. **Dependency Inversion Principle (DIP)**
   - Services depend on interfaces, not concrete implementations
   - Extensive use of Spring's dependency injection

## Database Schema

### Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (encrypted),
  role: String (STUDENT|INSTRUCTOR|ADMIN),
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    institution: String
  },
  createdDate: Date,
  lastModifiedDate: Date,
  active: Boolean
}
```

#### Courses Collection
```javascript
{
  _id: ObjectId,
  title: String (indexed),
  description: String,
  subject: String,
  difficulty: String (BEGINNER|INTERMEDIATE|ADVANCED|EXPERT),
  createdBy: String (instructor ID, indexed),
  createdDate: Date,
  lastModifiedDate: Date,
  published: Boolean
}
```

#### Topics Collection
```javascript
{
  _id: ObjectId,
  name: String (indexed),
  description: String,
  courseId: String (indexed),
  createdDate: Date,
  lastModifiedDate: Date
}
```

#### Learning Materials Collection
```javascript
{
  _id: ObjectId,
  title: String (indexed),
  type: String (TEXT|VIDEO|INTERACTIVE_EXERCISE),
  content: String,
  topicId: String (indexed),
  createdBy: String (indexed),
  createdDate: Date,
  lastModifiedDate: Date,
  filePath: String,
  mimeType: String,
  fileSize: Number,
  published: Boolean
}
```

#### Content History Collection
```javascript
{
  _id: ObjectId,
  materialId: String (indexed),
  title: String,
  content: String,
  changeDescription: String,
  changedBy: String (indexed),
  changeDate: Date,
  version: Number
}
```

## API Endpoints

### Authentication APIs
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
GET  /api/auth/me           - Get current user
GET  /api/auth/check-email/{email} - Check email availability
```

### Content Management APIs
```
GET    /api/content              - Get all content
GET    /api/content/{id}         - Get content by ID
GET    /api/content/topic/{id}   - Get content by topic
GET    /api/content/search       - Search content
POST   /api/content             - Create new content (INSTRUCTOR/ADMIN)
PUT    /api/content/{id}        - Update content (INSTRUCTOR/ADMIN)
DELETE /api/content/{id}        - Delete content (INSTRUCTOR/ADMIN)
POST   /api/content/upload      - Upload file (INSTRUCTOR/ADMIN)
GET    /api/content/categories  - Get content categories
```

## Features Implemented (80%)

### ✅ Authentication Module
- [x] User registration with role selection (Student/Instructor/Admin)
- [x] Email/password login
- [x] JWT token-based authentication
- [x] Password encryption (BCrypt)
- [x] Role-based access control
- [x] Protected routes (frontend)
- [x] Method-level security (backend)

### ✅ Learning Content Management Module
- [x] CRUD operations for learning materials
- [x] Content types: Text, Video, Interactive Exercise
- [x] Content categorization by topic
- [x] File upload for videos
- [x] Content search functionality
- [x] Instructor-specific content ownership
- [x] Content versioning/history tracking
- [x] Publish/Draft status

### ✅ Frontend Features
- [x] Responsive design
- [x] Authentication forms (Login/Register)
- [x] Protected route component
- [x] Content dashboard with CRUD operations
- [x] Content search and filtering
- [x] File upload component
- [x] User context management
- [x] Error handling and validation

### ✅ Backend Features
- [x] Layered architecture
- [x] SOLID principles implementation
- [x] JWT security configuration
- [x] MongoDB integration
- [x] Input validation
- [x] CORS configuration
- [x] Error handling
- [x] Repository pattern

## Features Excluded (20%)

### ❌ Not Implemented
- [ ] Advanced content analytics
- [ ] Content collaboration features
- [ ] Advanced search with Elasticsearch
- [ ] Content scheduling/publishing workflows
- [ ] Bulk operations
- [ ] Advanced file type validation
- [ ] Content recommendation engine
- [ ] Real-time notifications
- [ ] Course enrollment system
- [ ] Learning progress tracking

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 16+
- MongoDB 4.4+
- Maven 3.6+

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd its-backend
   ```

2. **Configure MongoDB**
   - Install and start MongoDB
   - Database will be created automatically as 'its_database'

3. **Update configuration** (optional)
   Edit `src/main/resources/application.properties`:
   ```properties
   spring.data.mongodb.database=its_database
   jwt.secret=your-secret-key
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   Backend will start on http://localhost:8080

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd its-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   Frontend will start on http://localhost:3000

### Testing the Application

1. **Register a new user**
   - Go to http://localhost:3000
   - Click "Register here"
   - Create accounts with different roles (Student/Instructor)

2. **Test content management**
   - Login as Instructor
   - Create different types of content
   - Test search and filtering

3. **Test role-based access**
   - Students can view content but cannot create/edit
   - Instructors can manage their own content
   - Admins have full access

## Key Design Patterns Used

### Backend Patterns
- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic separation  
- **DTO Pattern** - Data transfer objects
- **Strategy Pattern** - Role-based permissions
- **Factory Pattern** - Entity creation

### Frontend Patterns
- **Context API Pattern** - Global state management
- **HOC Pattern** - Protected routes
- **Container/Component Pattern** - Separation of concerns
- **Custom Hooks Pattern** - Reusable logic

## Security Features

- **JWT Authentication** - Stateless token-based auth
- **Password Encryption** - BCrypt hashing
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Both frontend and backend
- **Role-based Authorization** - Method and route level
- **XSS Protection** - Input sanitization

## Performance Considerations

- **Database Indexing** - On frequently queried fields
- **Lazy Loading** - Frontend component optimization
- **Connection Pooling** - MongoDB connection management
- **Caching** - Static file caching
- **Pagination** - For large content lists (ready to implement)

## Scalability Features

- **Stateless Design** - JWT tokens enable horizontal scaling
- **Microservice Ready** - Modular service architecture
- **Database Sharding Ready** - MongoDB supports horizontal scaling
- **CDN Ready** - File uploads can be moved to cloud storage
- **Load Balancer Compatible** - No server-side sessions

This ITS implementation provides a solid foundation for an educational platform with proper architecture, security, and extensibility for future enhancements.