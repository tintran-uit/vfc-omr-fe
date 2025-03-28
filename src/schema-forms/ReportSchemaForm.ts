const schemaForm = {
    fields: [
        {
            label: 'Adults',
            rules: 'required|number',
            type: 'text',
            groupTitle: '1. Main Worship Service Attendance'
        },
        {
            label: 'Youth [13-22]',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'Children [0-12]',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'No of Services for Children',
            rules: 'number',
            type: 'text'
        },
        {
            groupTitle: '2. Cell Groups',
            label: 'Number of Cell Groups',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'Total Attendance in All',
            rules: 'number',
            type: 'text'
        },
        {
            groupTitle: '3. Prayer Meetings',
            label: 'Number of Prayer',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'Total Attendance in All',
            rules: 'number',
            type: 'text'
        },
        {
            groupTitle: '4. Decisions, Discipling & Water Baptisms',
            label: 'Number of New Decisions',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'Number being Actively Discipled',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'AduNumber Water Baptisedlts',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'Number in an Encounter / Next Step Weekend',
            rules: 'number',
            type: 'text'
        },
        {
            groupTitle: '5. Teaching & Training',
            label: 'Number of GT/LIW',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'Total Attendance in all GT/LIW Classes',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'No of Leaders in training for',
            rules: 'number',
            type: 'text'
        },
        {
            groupTitle: '6. Giving',
            label: 'Tithes + Offerings',
            rules: 'number',
            type: 'text'
        },
        {
            label: 'Missions Giving [MFP]',
            rules: 'number',
            type: 'text'
        }
    ]
}


export default schemaForm;