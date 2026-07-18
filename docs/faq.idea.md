# FAQ Feature Specification

## Overview
This feature provides a full FAQ management system, including:
- Public FAQ listing and detail pages
- Search and filter capabilities
- Admin CRUD operations

---

## Frontend

### 1. FAQ List Page

#### Data Source
- Fetch data from API: `GET /api/v1/faqs`

#### Features
- Display list of FAQs with:
  - `id`
  - `question_header`

#### Search
- Search by `question_header`

Example: `/api/v1/faqs?question_header=Add%20a%20New%20Pastor`

#### Filter by Language
- Fields:
  - `language_id` (Label: **Language**)
  - `question_header` (Label: **Search**)
- `language_id` is a dropdown using `LanguageSelectInput`

Example: `/api/v1/faqs?language_id=1`

---

### 2. FAQ Detail Page

#### Display
- `question_header`
- `answer`
- `tags`

#### Print Functionality
- Provide a **Print button**
- Only print:
  - Question
  - Answer
  - Tags
- Exclude all other UI elements

---

### 3. Admin Features (CRUD)

> Only accessible for users with **admin permission**

#### Create FAQ
- Fields:
  - `question_header`
  - `answer`
  - `language_id`
  - `tags` (array of tag names)

#### Update FAQ
- Same fields as Create

#### Delete FAQ
- Delete by `id`

---

## API Specification

### 1. Get FAQ List

**Endpoint**
```
GET /api/v1/faqs
```

**Query Parameters (optional)**
- `question_header` (string)
- `language_id` (integer)

**Response Example**
```json
{
  "success": true,
  "data": [
    {
      "id": 20,
      "question_header": "How do I reset my password?",
      "answer": "To reset your password: 1. Click on Forgot Password, 2. Enter your email, 3. Check your inbox for reset link",
      "language_id": 1,
      "created_at": "2025-12-24T03:23:53Z",
      "modified_at": "2025-12-24T03:23:53Z",
      "tags": [
        {
          "id": 85,
          "tag_name": "account",
          "question_id": 20
        },
        {
          "id": 86,
          "tag_name": "security",
          "question_id": 20
        },
        {
          "id": 87,
          "tag_name": "password",
          "question_id": 20
        }
      ]
    }
  ]
}
```

---

### 2. Get FAQs by Language
```
GET /api/v1/faqs?language_id=1
```

---

### 3. Create FAQ
**Endpoint**
```
POST /api/v1/faqs
```

**Request Body**
```
{
  "question_header": "How do I reset my password?",
  "answer": "To reset your password: 1. Click on Forgot Password, 2. Enter your email, 3. Check your inbox for reset link",
  "language_id": 1,
  "tags": [
    { "tag_name": "account" },
    { "tag_name": "security" },
    { "tag_name": "password" }
  ]
}
```

---

### 4. Update FAQ

**Endpoint**
```
PATCH /api/v1/faqs/{id}
```

**Example**
```
PATCH /api/v1/faqs/21
```

**Request Body**
```
{
  "question_header": "How to reset password?",
  "answer": "Updated answer: Go to settings and click reset password...",
  "language_id": 1,
  "tags": [
    { "tag_name": "account" },
    { "tag_name": "updated" }
  ]
}
```

---

### 5. Delete FAQ

**Endpoint**
```
DELETE /api/v1/faqs/{id}
```

---

## Implementation Notes
- Treat `tags` as a nested resource
- Validate required fields:
  - `question_header`
  - `answer`
  - `language_id`
- Ensure proper handling of tag creation and updates
- Avoid duplicate tags if needed
- Use consistent response format
- Consider adding pagination in the future