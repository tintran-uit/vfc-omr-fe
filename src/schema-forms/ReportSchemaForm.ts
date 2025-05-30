const schemaForm = {
    fields: [
        {
            label: 'Adults',
            name: 'worship_sessions.0.attendance.adult_attendance',
            rules: 'required|number',
            type: 'text',
            groupTitle: '1. Main Worship Service Attendance'
        },
        {
            label: 'Youth [13-22]',
            name: 'worship_sessions.0.attendance.youth_attendance',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'Children [0-12]',
            name: 'worship_sessions.0.attendance.child_attendance',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'No of Services for Children',
            name: 'worship_sessions.0.attendance.number_of_service_for_children',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'cell_groups.number_of_cell_groups',
            groupTitle: '2. Cell Groups',
            label: 'Number of Cell Groups',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'cell_groups.weekly_attendance',
            label: 'Total Attendance in All',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'prayer_meetings.number_of_meetings',
            groupTitle: '3. Prayer Meetings',
            label: 'Number of Prayer',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'prayer_meetings.weekly_attendance',
            label: 'Total Attendance in All',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'new_decisions.weekly_decisions_made',
            groupTitle: '4. Decisions, Discipling & Water Baptisms',
            label: 'Number of New Decisions',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'active_disciples.being_actively_discipled',
            label: 'Number being Actively Discipled',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'water_baptisms.weekly_water_baptism',
            label: 'AduNumber Water Baptisedlts',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'number_encounter',
            label: 'Number in an Encounter / Next Step Weekend',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'liw_classes.number_of_classes',
            groupTitle: '5. Teaching & Training',
            label: 'Number of GT/LIW',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'liw_classes.total_number_of_students',
            label: 'Total Attendance in all GT/LIW Classes',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'leadership_trainings.number_of_leaders_in_training',
            label: 'No of Leaders in training for',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'givings.in_local_currency',
            groupTitle: '6. Giving',
            label: 'Tithes + Offerings',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'mfp_givings.in_local_currency',
            label: 'Missions Giving [MFP]',
            rules: 'number',
            type: 'text'
        }
    ]
}


export default schemaForm;