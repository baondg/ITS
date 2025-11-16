# API Documentation - Intelligent Tutoring System

## Base URL
```
http://localhost:8080/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### 1. User Registration

**Endpoint:** `POST /auth/register`

**Description:** Register a new user in the system

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "role": "STUDENT",
  "firstName": "John",
  "lastName": "Doe",
  "institution": "University of Technology"
}
```

**Response (Success):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "64a8f123456789abcdef0123",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "institution": "University of Technology"
  }
}
```

**Response (Error):**
```json
{
  "message": "Email already exists"
}
```

**Status Codes:**
- `200 OK` - Registration successful
- `400 Bad Request` - Validation error or email exists

---

### 2. User Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response (Success):**
```json
{
  "accessToken": "eyJhbGciOiJIUzUxMiJ9...",
  "tokenType": "Bearer",
  "user": {
    "id": "64a8f123456789abcdef0123",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "firstName": "John",
    "lastName": "Doe",
    "institution": "University of Technology"
  }
}
```

**Response (Error):**
```json
{
  "message": "Invalid credentials"
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Invalid credentials

---

### 3. Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get current authenticated user information

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "id": "64a8f123456789abcdef0123",
  "email": "john.doe@example.com",
  "role": "STUDENT",
  "firstName": "John",
  "lastName": "Doe",
  "institution": "University of Technology"
}
```

**Status Codes:**
- `200 OK` - Success
- `401 Unauthorized` - Invalid or missing token

---

### 4. Check Email Availability

**Endpoint:** `GET /auth/check-email/{email}`

**Description:** Check if an email is already registered

**Parameters:**
- `email` (path) - Email address to check

**Response:**
```json
true
```

**Status Codes:**
- `200 OK` - Always returns boolean

---

## Content Management Endpoints

### 1. Get All Content

**Endpoint:** `GET /content`

**Description:** Retrieve all published learning materials

**Response:**
```json
[
  {
    "id": "64a8f123456789abcdef0456",
    "title": "Introduction to Java Programming",
    "type": "TEXT",
    "content": "Java is a programming language...",
    "topicId": "64a8f123456789abcdef0789",
    "createdBy": "64a8f123456789abcdef0123",
    "createdDate": "2023-07-01T10:00:00",
    "lastModifiedDate": "2023-07-01T10:00:00",
    "published": true
  }
]
```

**Status Codes:**
- `200 OK` - Success

---

### 2. Get Content by ID

**Endpoint:** `GET /content/{id}`

**Description:** Retrieve a specific learning material by its ID

**Parameters:**
- `id` (path) - Content ID

**Response:**
```json
{
  "id": "64a8f123456789abcdef0456",
  "title": "Introduction to Java Programming",
  "type": "TEXT",
  "content": "Java is a programming language...",
  "topicId": "64a8f123456789abcdef0789",
  "createdBy": "64a8f123456789abcdef0123",
  "createdDate": "2023-07-01T10:00:00",
  "lastModifiedDate": "2023-07-01T10:00:00",
  "published": true
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Content not found

---

### 3. Get Content by Topic

**Endpoint:** `GET /content/topic/{topicId}`

**Description:** Retrieve all published content for a specific topic

**Parameters:**
- `topicId` (path) - Topic ID

**Response:**
```json
[
  {
    "id": "64a8f123456789abcdef0456",
    "title": "Introduction to Java Programming",
    "type": "TEXT",
    "content": "Java is a programming language...",
    "topicId": "64a8f123456789abcdef0789",
    "createdBy": "64a8f123456789abcdef0123",
    "createdDate": "2023-07-01T10:00:00",
    "published": true
  }
]
```

**Status Codes:**
- `200 OK` - Success

---

### 4. Search Content

**Endpoint:** `GET /content/search`

**Description:** Search for content by title

**Query Parameters:**
- `query` (required) - Search term

**Example:** `/content/search?query=java programming`

**Response:**
```json
[
  {
    "id": "64a8f123456789abcdef0456",
    "title": "Introduction to Java Programming",
    "type": "TEXT",
    "content": "Java is a programming language...",
    "topicId": "64a8f123456789abcdef0789",
    "createdBy": "64a8f123456789abcdef0123",
    "createdDate": "2023-07-01T10:00:00",
    "published": true
  }
]
```

**Status Codes:**
- `200 OK` - Success

---

### 5. Create Content

**Endpoint:** `POST /content`

**Description:** Create new learning material

**Headers:** `Authorization: Bearer <jwt_token>`

**Required Roles:** `INSTRUCTOR`, `ADMIN`

**Request Body:**
```json
{
  "title": "Advanced Java Concepts",
  "type": "TEXT",
  "content": "This lesson covers advanced Java concepts...",
  "topicId": "64a8f123456789abcdef0789",
  "published": false
}
```

**Response:**
```json
{
  "id": "64a8f123456789abcdef0999",
  "title": "Advanced Java Concepts",
  "type": "TEXT",
  "content": "This lesson covers advanced Java concepts...",
  "topicId": "64a8f123456789abcdef0789",
  "createdBy": "64a8f123456789abcdef0123",
  "createdDate": "2023-07-02T14:30:00",
  "lastModifiedDate": "2023-07-02T14:30:00",
  "published": false
}
```

**Status Codes:**
- `200 OK` - Content created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions

---

### 6. Update Content

**Endpoint:** `PUT /content/{id}`

**Description:** Update existing learning material

**Headers:** `Authorization: Bearer <jwt_token>`

**Required Roles:** `INSTRUCTOR` (own content), `ADMIN`

**Parameters:**
- `id` (path) - Content ID

**Request Body:**
```json
{
  "title": "Advanced Java Concepts - Updated",
  "type": "TEXT", 
  "content": "This lesson covers advanced Java concepts with new examples...",
  "topicId": "64a8f123456789abcdef0789",
  "published": true
}
```

**Response:**
```json
{
  "id": "64a8f123456789abcdef0999",
  "title": "Advanced Java Concepts - Updated",
  "type": "TEXT",
  "content": "This lesson covers advanced Java concepts with new examples...",
  "topicId": "64a8f123456789abcdef0789",
  "createdBy": "64a8f123456789abcdef0123",
  "createdDate": "2023-07-02T14:30:00",
  "lastModifiedDate": "2023-07-02T15:45:00",
  "published": true
}
```

**Status Codes:**
- `200 OK` - Content updated successfully
- `400 Bad Request` - Validation error or access denied
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Content not found

---

### 7. Delete Content

**Endpoint:** `DELETE /content/{id}`

**Description:** Delete a learning material

**Headers:** `Authorization: Bearer <jwt_token>`

**Required Roles:** `INSTRUCTOR` (own content), `ADMIN`

**Parameters:**
- `id` (path) - Content ID

**Response:** No content (empty body)

**Status Codes:**
- `200 OK` - Content deleted successfully
- `400 Bad Request` - Access denied
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Content not found

---

### 8. Upload File

**Endpoint:** `POST /content/upload`

**Description:** Upload a file (video, document, etc.)

**Headers:** 
- `Authorization: Bearer <jwt_token>`
- `Content-Type: multipart/form-data`

**Required Roles:** `INSTRUCTOR`, `ADMIN`

**Request Body:** Form data with file

**Response:**
```json
{
  "message": "File uploaded successfully: ./uploads/uuid_filename.mp4"
}
```

**Status Codes:**
- `200 OK` - File uploaded successfully
- `400 Bad Request` - Upload error
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions

---

### 9. Get Categories

**Endpoint:** `GET /content/categories`

**Description:** Get available content types

**Response:**
```json
[
  "TEXT",
  "VIDEO", 
  "INTERACTIVE_EXERCISE"
]
```

**Status Codes:**
- `200 OK` - Success

---

## Data Models

### User Model
```json
{
  "id": "string",
  "email": "string",
  "role": "STUDENT | INSTRUCTOR | ADMIN",
  "profile": {
    "firstName": "string",
    "lastName": "string", 
    "avatar": "string",
    "bio": "string",
    "institution": "string"
  },
  "createdDate": "datetime",
  "lastModifiedDate": "datetime",
  "active": "boolean"
}
```

### Learning Material Model
```json
{
  "id": "string",
  "title": "string",
  "type": "TEXT | VIDEO | INTERACTIVE_EXERCISE",
  "content": "string",
  "topicId": "string",
  "createdBy": "string",
  "createdDate": "datetime",
  "lastModifiedDate": "datetime",
  "filePath": "string (optional)",
  "mimeType": "string (optional)",
  "fileSize": "number (optional)",
  "published": "boolean"
}
```

### Content History Model
```json
{
  "id": "string",
  "materialId": "string",
  "title": "string",
  "content": "string", 
  "changeDescription": "string",
  "changedBy": "string",
  "changeDate": "datetime",
  "version": "number"
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "message": "Error description",
  "timestamp": "2023-07-01T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "path": "/api/content"
}
```

### Common Error Codes
- `400 Bad Request` - Validation errors, malformed requests
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - Insufficient permissions for the operation
- `404 Not Found` - Requested resource not found
- `500 Internal Server Error` - Unexpected server error

---

## Rate Limiting

Currently, no rate limiting is implemented, but it can be added using Spring Boot Actuator and Redis.

## Versioning

The API is currently version 1. Future versions will be prefixed with `/api/v2/`, etc.

This API documentation provides all the endpoints needed for the Authentication and Learning Content Management modules of the Intelligent Tutoring System.