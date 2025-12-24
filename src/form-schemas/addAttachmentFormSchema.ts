export const createFormSchema = () => ({
    name: '',
    fields: [
        {
            label: 'attachment.labelFile',
            name: 'file',
            rules: ['required'],
            type: 'FileUploadInput'
        },
        {
            label: 'attachment.labelName',
            name: 'name',
            rules: [],
            type: 'TextInput'
        }
    ]
})