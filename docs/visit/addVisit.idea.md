# Visits & Events Tracking — Full Implementation Specification

---

## Overview

This feature is a **2-step form workflow**:


| Step | Name          | Responsibility                        |
| ---- | ------------- | ------------------------------------- |
| 1    | Context Setup | Select user + time range (weeks/year) |
| 2    | Data Entry    | Input Visits & Events per week        |


---

## Step 1 — Context Setup

### Purpose

Define the **global context** used by Step 2:

- User
- Year
- Weeks range

| Field  | Label | Type   | Layout       | Notes             |
| ------ | ------ | ------------ | ----------------- |
| number_of_churches | Number of Churches Visited | SelectInput | cols:12 md:6 |  Value 0 -> 100|
| number_of_events | Number of Events You Organised | SelectInput | cols:12 md:6 |  Value 0 -> 100|

# Visits & Events Tracking — Implementation Specification

## Church Visit Module

### UI Structure

Each **Visit block** must be wrapped by:

- `@/components/shared/CardHeader.vue`

### Card Title

- Format: `My Visit to Church {index}`  
Example:
  - My Visit to Church 1
  - My Visit to Church 2

---

### Form Fields


| Field  | Type   | Layout       | Notes             |
| ------ | ------ | ------------ | ----------------- |
| nation | select | cols:12 md:6 | Parent of City    |
| city   | select | cols:12 md:6 | Depends on Nation |
| church | select | cols:12 md:6 | Depends on City   |


### Weekly Input Table


| Week [Wk], Year | wk14, 2026 30 Mar - 05 Apr | wk18, 2026 27 Apr - 03 May |
| --------------- | -------------------------- | -------------------------- |
| Days Visited    | number input               | number input               |


#### Notes

- Each column = 1 week
- Value = number of days visiting the church in that week

---

### API — Save Visits

**Endpoint**
POST /api/v1/visits/bulk
**Request Body Example**

```json
[
  {
    "user_id": 242,
    "church_id": 76,
    "year": 2025,
    "week_number": 33,
    "number_of_days": 1
  }
]
```

---

## 2. Event Tracking Module

### UI Structure

Each **Visit block** must be wrapped by:

- `@/components/shared/CardHeader.vue`

### Card Title

- Format: `My Visit to My Organised Event {index}`

### Form Fields


| Field      | Type     | Layout       | Source / Notes             |
| ---------- | -------- | ------------ | -------------------------- |
| nation     | select   | cols:12 md:6 |                            |
| eventType  | dropdown | cols:12 md:6 | API: `/api/v1/event-types` |
| eventName  | text     | cols:12      |                            |
| attendance | number   | cols:12      | Approx. attendees          |


### Event Type API

**Endpoint**

```
GET /api/v1/event-types
```

**Response**

```
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Conference / Seminar",
      "color": "#C0504D",
      "cell_color": "#E6B8B7",
      "meeting_type": "Attendance"
    }
  ]
}
```

---

### Weekly Input Table


| Week [Wk], Year | wk14, 2026 30 Mar - 05 Apr | wk18, 2026 27 Apr - 03 May |
| --------------- | -------------------------- | -------------------------- |
| Days Attended   | number input               | number input               |


---

### Tooltip Definition

- 

Label: `Days Attended`  

- Tooltip content:
  > Number of days you attended this event in the selected week

---

### API — Save Events

**Endpoint**

```
POST /api/v1/events/bulk
```

---

### Request Body Example

```
[
  {
    "name": "Youth Conference",
    "event_type_id": 2,
    "user_id": 4709,
    "attendance": 50,
    "country_id": 1,
    "number_of_days": 2,
    "year": 2024,
    "week_number": 25
  },
  {
    "id": 5176,
    "name": "1-1 Meeting",
    "event_type_id": 4,
    "user_id": 4709,
    "meeting_with": 4449,
    "country_id": 1,
    "number_of_days": 3,
    "year": 2024,
    "week_number": 25
  }
]
```

---

## 3. Shared Logic

### Dynamic Weeks

- Weeks must be dynamically generated

Format:

```
wk{week_number}, {year}
{start_date} - {end_date}
```

---

### Data Mapping Rules

#### Visit Mapping


| UI Field     | API Field      |
| ------------ | -------------- |
| church       | church_id      |
| days visited | number_of_days |


#### Event Mapping


| UI Field      | API Field      |
| ------------- | -------------- |
| eventType     | event_type_id  |
| eventName     | name           |
| attendance    | attendance     |
| days attended | number_of_days |


---

### Conditional Fields

- If `event_type.meeting_type = "1-1"`:
  - Show additional field:
    - `meeting_with`

---

## 4. Save Action Flow

When user clicks **Save**:

1. Transform UI data → API payload
2. Split into:
  - visits payload
  - events payload
3. Call APIs in parallel:

```
POST /api/v1/visits/bulk
POST /api/v1/events/bulk
```

---

## 5. Validation Rules

- nation, city, church: required (visit)
- eventType, eventName: required (event)
- weekly inputs:
  - must be >= 0
  - integer only

