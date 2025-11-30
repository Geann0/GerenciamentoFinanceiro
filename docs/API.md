# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All API endpoints (except auth endpoints) require authentication using NextAuth session cookies.

### Register User

**Endpoint:** `POST /auth/register`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `201 Created`

```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login

Use NextAuth endpoints:

- Sign in: `POST /auth/signin`
- Sign out: `POST /auth/signout`

## Transactions

### Create Transaction

**Endpoint:** `POST /transactions`

**Request Body:**

```json
{
  "type": "INCOME",
  "amount": 1000.5,
  "description": "Monthly salary",
  "date": "2024-01-15T00:00:00.000Z",
  "categoryId": "category-uuid",
  "tags": ["salary", "monthly"]
}
```

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "type": "INCOME",
  "amount": 1000.5,
  "description": "Monthly salary",
  "date": "2024-01-15T00:00:00.000Z",
  "category": {
    "id": "uuid",
    "name": "Salary"
  },
  "tags": [
    {
      "tag": {
        "id": "uuid",
        "name": "salary"
      }
    }
  ],
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

### Get Transactions

**Endpoint:** `GET /transactions`

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `type` (string): INCOME or EXPENSE
- `categoryId` (string): Filter by category
- `startDate` (string): ISO date string
- `endDate` (string): ISO date string
- `minAmount` (number): Minimum amount
- `maxAmount` (number): Maximum amount
- `tags` (string): Comma-separated tag names

**Example:**

```
GET /transactions?page=1&limit=20&type=EXPENSE&startDate=2024-01-01
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "EXPENSE",
      "amount": 50.0,
      "description": "Grocery shopping",
      "date": "2024-01-16T00:00:00.000Z",
      "category": {
        "id": "uuid",
        "name": "Food"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Get Transaction by ID

**Endpoint:** `GET /transactions/:id`

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "type": "INCOME",
  "amount": 1000.50,
  "description": "Monthly salary",
  "date": "2024-01-15T00:00:00.000Z",
  "category": { ... },
  "tags": [ ... ],
  "attachments": [ ... ]
}
```

### Update Transaction

**Endpoint:** `PATCH /transactions/:id`

**Request Body:**

```json
{
  "amount": 1050.0,
  "description": "Updated description"
}
```

**Response:** `200 OK`

```json
{
  "id": "uuid",
  "amount": 1050.00,
  "description": "Updated description",
  ...
}
```

### Delete Transaction

**Endpoint:** `DELETE /transactions/:id`

**Response:** `200 OK`

```json
{
  "message": "Transaction deleted successfully"
}
```

### Get Statistics

**Endpoint:** `GET /transactions/statistics`

**Query Parameters:**

- `startDate` (string): ISO date string
- `endDate` (string): ISO date string

**Response:** `200 OK`

```json
{
  "balance": {
    "totalIncome": 5000.0,
    "totalExpense": 2000.0,
    "balance": 3000.0
  },
  "categoryStats": [
    {
      "categoryId": "uuid",
      "type": "INCOME",
      "_sum": {
        "amount": 5000.0
      },
      "_count": 5
    }
  ],
  "monthlyStats": [
    {
      "month": "2024-01-01",
      "type": "INCOME",
      "total": 5000.0,
      "count": 5
    }
  ]
}
```

## Categories

### Create Category

**Endpoint:** `POST /categories`

**Request Body:**

```json
{
  "name": "Salary",
  "description": "Monthly income from employment",
  "color": "#10b981",
  "icon": "💰",
  "parentId": null
}
```

**Response:** `201 Created`

### Get Categories

**Endpoint:** `GET /categories`

**Query Parameters:**

- `all` (boolean): Get all categories (flat) or just root categories (default: false)

**Response:** `200 OK`

```json
[
  {
    "id": "uuid",
    "name": "Income",
    "color": "#10b981",
    "subcategories": [
      {
        "id": "uuid",
        "name": "Salary",
        "parentId": "parent-uuid"
      }
    ]
  }
]
```

## Reports

### Generate Financial Report

**Endpoint:** `GET /reports`

**Query Parameters:**

- `startDate` (string): ISO date string
- `endDate` (string): ISO date string
- `categoryId` (string): Filter by category
- `type` (string): INCOME or EXPENSE

**Response:** `200 OK`

```json
{
  "summary": {
    "totalIncome": 10000.00,
    "totalExpense": 5000.00,
    "balance": 5000.00,
    "transactionCount": 50,
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31"
    }
  },
  "transactions": [ ... ],
  "categoryBreakdown": [
    {
      "category": { "name": "Food" },
      "type": "EXPENSE",
      "total": 1000.00,
      "count": 20
    }
  ],
  "monthlyTrend": [ ... ]
}
```

### Export to CSV

**Endpoint:** `GET /reports/export/csv`

**Query Parameters:**

- `format` (string): "transactions" or "categories"
- `startDate`, `endDate`, `categoryId`, `type` (same as reports)

**Response:** `200 OK` (CSV file download)

### Export to HTML/PDF

**Endpoint:** `GET /reports/export/pdf`

**Query Parameters:** Same as reports

**Response:** `200 OK` (HTML file download)

## File Upload

### Upload Attachment

**Endpoint:** `POST /upload`

**Request Body:** `multipart/form-data`

- `file` (File): The file to upload
- `transactionId` (string): Transaction UUID
- `storageType` (string): "s3" or "google_drive"

**Response:** `201 Created`

```json
{
  "id": "uuid",
  "transactionId": "uuid",
  "fileName": "receipt.pdf",
  "fileUrl": "https://...",
  "fileSize": 1024000,
  "mimeType": "application/pdf",
  "storageType": "s3",
  "createdAt": "2024-01-15T00:00:00.000Z"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["amount"],
      "message": "Amount must be positive"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "Unauthorized - Please login to continue"
}
```

### 404 Not Found

```json
{
  "error": "Transaction not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

Rate limiting is not currently implemented but recommended for production:

- 100 requests per minute per user
- 1000 requests per hour per user

## Pagination

List endpoints support pagination with the following parameters:

- `page`: Page number (starting from 1)
- `limit`: Items per page (max 100)

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```
