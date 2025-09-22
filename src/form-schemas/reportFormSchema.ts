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
            name: 'weekly_church_events.cell_group_count',
            groupTitle: '2. Cell Groups',
            label: 'Number of Cell Groups',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_church_events.cell_group_weekly_attendance',
            label: 'Total Attendance in All',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_church_events.prayer_meeting_count',
            groupTitle: '3. Prayer Meetings',
            label: 'Number of Prayer',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_church_events.prayer_meeting_weekly_attendance',
            label: 'Total Attendance in All',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_spiritual_growth.water_baptisms',
            groupTitle: '4. Decisions, Discipling & Water Baptisms',
            label: 'Number of New Decisions',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_spiritual_growth.active_disciples',
            label: 'Number being Actively Discipled',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_spiritual_growth.weekly_water_baptism',
            label: 'AduNumber Water Baptisedlts',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_spiritual_growth',
            label: 'Number in an Encounter / Next Step Weekend',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_church_events.liw_class_count',
            groupTitle: '5. Teaching & Training',
            label: 'Number of GT/LIW',
            rules: 'number',
            type: 'text'
        },
        {
            name: 'weekly_church_events.liw_class_total_students',
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