// project imports
import mock from '../mockAdapter';

// user list
const userList = {
  "success": true,
  "data": {
      "items": [
          {
              "id": 4,
              "first_name": "Santo",
              "last_name": "Lim Hendra",
              "username": "Santo_Lim",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "Santo Lim Hendra",
              "church_id": 12,
              "role_id": 3,
              "created": null,
              "modified": "2020-03-19T16:31:05Z"
          },
          {
              "id": 5,
              "first_name": "AL",
              "last_name": "",
              "username": "chkc",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "AL ",
              "church_id": 92,
              "role_id": 3,
              "created": null,
              "modified": "2015-11-30T08:30:55Z"
          },
          {
              "id": 7,
              "first_name": "Artem",
              "last_name": "Mnatsakanyan",
              "username": "Artem_Mnatsakanyan",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "Artem Mnatsakanyan",
              "church_id": 23,
              "role_id": 3,
              "created": null,
              "modified": "2024-03-26T06:30:02Z"
          },
          {
              "id": 10,
              "first_name": "bram-1",
              "last_name": "",
              "username": "bram-1",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "bram-1 ",
              "church_id": 222,
              "role_id": 3,
              "created": null,
              "modified": "2017-04-11T15:24:53Z"
          },
          {
              "id": 11,
              "first_name": "anw-1",
              "last_name": "",
              "username": "anw-1",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "anw-1 ",
              "church_id": 223,
              "role_id": 3,
              "created": null,
              "modified": "2023-06-19T13:39:45Z"
          },
          {
              "id": 12,
              "first_name": "anw-2",
              "last_name": "",
              "username": "anw-2",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "anw-2 ",
              "church_id": 224,
              "role_id": 3,
              "created": null,
              "modified": "2017-04-11T14:33:29Z"
          },
          {
              "id": 13,
              "first_name": "Saddar-1",
              "last_name": "",
              "username": "Saddar-1",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "Saddar-1 ",
              "church_id": 225,
              "role_id": 3,
              "created": null,
              "modified": "2017-04-11T14:33:00Z"
          },
          {
              "id": 14,
              "first_name": "pns-shifa",
              "last_name": "",
              "username": "pns-shifa",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "pns-shifa ",
              "church_id": 226,
              "role_id": 3,
              "created": null,
              "modified": "2017-04-11T14:33:53Z"
          },
          {
              "id": 15,
              "first_name": "q-abad",
              "last_name": "",
              "username": "q-abad",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "q-abad ",
              "church_id": 227,
              "role_id": 3,
              "created": null,
              "modified": "2017-04-11T14:34:36Z"
          },
          {
              "id": 16,
              "first_name": "n-abad",
              "last_name": "",
              "username": "n-abad",
              "createdAt": "0001-01-01T00:00:00Z",
              "name": "n-abad ",
              "church_id": 228,
              "role_id": 3,
              "created": null,
              "modified": "2017-04-11T15:41:13Z"
          }
      ],
      "total": 4012,
      "page": 1,
      "limit": 10,
      "total_pages": 402,
      "has_next": true,
      "has_previous": false
  },
  "message": "Pastors retrieved successfully"
}

// ==============================|| MOCK SERVICES ||============================== //
mock.onGet('/api/v1/users').reply(() => {
  return [200, userList];
});