export const createFormSchema = () => ({
    name: 'language.addTitle',
    initData: () => ({
        'pastor_credential_locked': false
    }),
    fields: [
        {
            label: 'language.labelName',
            name: 'name',
            rules: ['required'],
            type: 'TextInput'
        }
    ]
})