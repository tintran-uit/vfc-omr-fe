export const createFormSchema = () => ({
    name: 'churchType.addTitle',
    initData: () => ({
        'pastor_credential_locked': false
    }),
    fields: [
        {
            label: 'churchType.labelName',
            name: 'name',
            rules: ['required'],
            type: 'TextInput'
        }
    ]
})