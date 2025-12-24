export const createFormSchema = () => ({
    // initData: () => ({
    // }),
    fields: [
        {
            label: 'user.labelOldPassword',
            name: 'old_password',
            rules: [
                'required'
            ],
            type: 'PasswordInput'
        },
        {
            label: 'user.labelNewPassword',
            name: 'new_password',
            rules: [
                'required',
                'min:6',
            ],
            type: 'PasswordInput'
        },
        {
            label: 'user.labelRepeatNewPassword',
            name: 'repeat_new_password',
            rules: [
                'required',
                'min:6',
                'repeatPassword:new_password'
            ],
            type: 'PasswordInput'
        },
    ]
})