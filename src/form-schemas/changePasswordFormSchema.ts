export const createFormSchema = () => ({
    // initData: () => ({
    // }),
    fields: [
        {
            label: 'userLabel.newPassword',
            name: 'new_password',
            rules: [
                'required',
                'min:6'
            ],
            type: 'PasswordInput'
        },
        {
            label: 'userLabel.repeatNewPassword',
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