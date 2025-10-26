import { at } from "lodash";

const schemaForm = {
    initData: () => ({
        
    }),
    fields: [
        {
            label: 'labelService.name',
            name: 'name',
            rules: ['required'],
        },
        {
            label: 'labelService.dayName',
            name: 'day_name',
            rules: ['required'],
            type: 'WeekDayInput'
        },
        {
            label: 'labelService.time',
            name: 'time',
            type: 'TimeInput'
        },
    ]
}


export default schemaForm;