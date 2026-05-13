# OMR Support Feature — Implementation Specification

## Overview

This feature allows users to submit support requests directly from the OMR system. The goal is to provide a simple and guided way for users to report issues, ask questions, or give feedback.

---

## UI — Support Form

### Description Text

Display the following message at the top of the form:

Hi {name},

Welcome to OMR, your monthly reporting tool designed to help you manage your church and church planting.

Help yourself and those you are leading by submitting your monthly reports regularly.

If you have any recommendations, please feel free to contact me.  
If you are experiencing any difficulties, I will do my best to assist you.

Just complete the form below.

Blessings,  
Shane Comiskey

- `{name}` should be dynamically replaced with the currently logged-in user's name.

---

## Form Fields


| Field   | Type     | Required | Description                                                      |
| ------- | -------- | -------- | ---------------------------------------------------------------- |
| name    | text     | yes      | Auto-filled with the logged-in user's name (read-only or hidden) |
| subject | text     | yes      | Short title of the support request                               |
| message | textarea | yes      | Detailed description of the issue or request                     |


---

## Validation Rules

- `name`: must not be empty (auto-filled)
- `subject`: required
- `message`: required

---

## API Integration

### Endpoint

POST /api/v1/support

### Request Payload

```json
{
  "name": "Tin Tran",
  "subject": "Support Request",
  "message": "I am facing an issue with the system. Please help me resolve it."
}
```



