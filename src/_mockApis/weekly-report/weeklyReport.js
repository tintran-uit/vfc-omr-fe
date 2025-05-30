import mock from '../mockAdapter';

mock.onGet('/api/v1/churches/3/weekly-report').reply(200, {
    "church_id": 3,
    "year": 2025,
    "week_number": 12,
    "worship_sessions": [
        {
            "id": 5325,
            "name": "Sunday Morning Service",
            "day_name": "Sunday",
            "time": "09:00:00",
            "attendance": {
                "adult_attendance": 100,
                "youth_attendance": 50,
                "child_attendance": 30,
                "number_of_service_for_children": 0
            }
        },
        {
            "id": 5326,
            "name": "Sunday Morning Service",
            "day_name": "Sunday",
            "time": "09:00:00",
            "attendance": {
                "adult_attendance": 100,
                "youth_attendance": 50,
                "child_attendance": 30,
                "number_of_service_for_children": 0
            }
        }
    ],
    "cell_groups": {
        "number_of_cell_groups": 5,
        "weekly_attendance": 50
    },
    "prayer_meetings": {
        "number_of_meetings": 0,
        "weekly_attendance": 0
    },
    "new_decisions": {
        "weekly_decisions_made": 0
    },
    "active_disciples": {
        "being_actively_discipled": 0
    },
    "water_baptisms": {
        "weekly_water_baptism": 3
    },
    "liw_classes": {
        "number_of_classes": 0,
        "total_number_of_students": 0
    },
    "leadership_trainings": {
        "number_of_leaders_in_training": 0
    },
    "givings": {
        "in_local_currency": 0,
        "in_usd": 0
    },
    "mfp_givings": {
        "in_local_currency": 0,
        "in_usd": 0
    }
});

export default mock;