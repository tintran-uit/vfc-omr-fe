export const createFormSchema = () => ({
    name: 'country.addTitle',
    initData: () => ({
        'pastor_credential_locked': false
    }),
    fields: [
        {
            label: 'country.labelName',
            name: 'name',
            rules: ['required'],
            type: 'TextInput'
        }
    ]
})