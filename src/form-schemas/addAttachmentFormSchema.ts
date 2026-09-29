export const createFormSchema = () => ({
    name: '',
    initData: () => ({
        file: null,
        name: '',
    }),
    fields: [
        {
            label: 'attachment.labelFile',
            name: 'file',
            rules: ['required'],
            type: 'FileUploadInput',
            cols: { cols: 12, md: 5 },
        },
        {
            label: 'attachment.labelName',
            name: 'name',
            rules: [],
            type: 'TextInput',
            cols: { cols: 12, md: 5 },
        }
    ]
})