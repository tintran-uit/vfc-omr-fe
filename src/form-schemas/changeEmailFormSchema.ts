export const createFormSchema = () => ({
    fields: [
        {
            label: 'user.labelCurrentEmail',
            name: 'old_email',
            rules: ['required', 'email'],
            type: 'TextInput',
            cols: 12,
        },
        {
            label: 'user.labelNewEmailAddress',
            name: 'new_email',
            rules: ['required', 'email'],
            type: 'TextInput',
            cols: 12,
        },
        {
            label: 'user.labelPassword',
            name: 'password',
            rules: ['required'],
            type: 'PasswordInput',
            cols: 12,
        },
    ],
})
