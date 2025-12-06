export const createFormSchema = () => ({
    name: 'churchNetwork.addTitle',
    initData: () => ({
        'pastor_credential_locked': false
    }),
    fields: [
        {
            label: 'churchNetwork.labelName',
            name: 'name',
            rules: ['required'],
            type: 'TextInput'
        },
        {
            label: 'churchNetwork.labelPastorCredentialLocked',
            name: 'pastor_credential_locked',
            rules: [],
            type: 'YesNoInput'
        }
    ]
})