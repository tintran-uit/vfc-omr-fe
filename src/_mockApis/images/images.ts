// project imports
import mock from '../mockAdapter';

// ==============================|| MOCK SERVICES ||============================== //
mock.onPost('/api/v1/images/upload').reply(() => {
  return [
    200, 
    {
      "success": true,
      "data": {
          "alt_text": "cover image",
          "entity_id": null,
          "entity_type": "churches",
          "is_in_use": false,
          "path": "https://i.ibb.co/2K8mK7W/avatar-1.png"
      },
      "message": "Request was successful"
    }
  ];
});
