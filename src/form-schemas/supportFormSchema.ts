export const createFormSchema = () => ({
    fields: [
        {
            label: 'support.labelName',
            name: 'name',
            rules: ['required'],
            type: 'TextInput',
        },
        {
            label: 'support.labelSubject',
            name: 'subject',
            rules: ['required'],
            type: 'TextInput',
        },
        {
            label: 'support.labelMessage',
            name: 'message',
            rules: ['required'],
            type: 'TextareaInput',
        }
    ]
})