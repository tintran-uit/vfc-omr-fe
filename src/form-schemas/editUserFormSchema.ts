export const createFormSchema = () => ({
    initData: () => ({
        sensitive_nation: false,
    }),
    fields: [
        {
            label: 'label.user.username',
            name: 'username',
            description: 'fieldDescription.user.username',
            rules: ['required'],
            type: 'TextInput'
        },
        {
            label: 'label.user.password',
            type: 'ChangePassword',
            component: true,
        },
        {
            label: 'label.user.prefix',
            name: 'prefix',
            type: 'SelectInput',
            optionName: 'prefixes',
        },
        {
            label: 'label.user.firstName',
            name: 'first_name',
            rules: ['required'],
            type: 'TextInput'
        },
        {
            label: 'label.user.lastName',
            name: 'last_name',
            type: 'TextInput'
        },
        {
            label: 'label.user.title',
            name: 'title',
            description: 'fieldDescription.user.title',
            type: 'TextInput'
        },
        {
            label: 'label.user.role',
            name: 'role_id',
            description: 'fieldDescription.user.role',
            rules: ['required'],
            type: 'SelectInput',
            optionName: 'roles',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'label.user.church',
            name: 'church_id',
            description: 'fieldDescription.user.church',
            rules: ['required'],
            type: 'ChurchSelectInput',
            optionName: 'churches',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'label.user.userPhoto',
            name: 'user_photo',
            description: 'fieldDescription.user.userPhoto',
            type: 'PhotoUploadInput',
            initialImageKey: 'photo_url',
            attrs: {
                entity_type: 'users'
            }
        },
        {
            label: 'label.user.country',
            name: 'country_id',
            rules: ['required'],
            type: 'CountrySelectInput',
        },
        {
            label: 'label.user.sensiveNation',
            name: 'sensitive_nation',
            description: 'fieldDescription.user.sensitiveNation',
            type: 'YesNoInput',
            defaultValue: false,
        },
        {
            label: 'label.user.language',
            name: 'language_id',
            desciprion: 'fieldDescription.user.language',
            rules: ['required'],
            type: 'LanguageSelectInput',
        },
        {
            label: 'label.user.mobilePhone',
            name: 'mobile_phone',
        },
        {
            label: 'label.user.emailAddress',
            name: 'email_address',
        },
        {
            label: 'label.user.credentials',
            name: 'credentials',
            type: 'SelectInput',
            optionName: 'credentials',
            attrs: {
                
            }
        },
        {
            label: 'label.user.credentialsNumber',
            name: 'credentials_number',
            type: 'TextInput'
        },
        {
            label: 'label.user.credentialsFrom',
            name: 'credentials_from',
            type: 'TextInput'
        },
        {
            label: 'label.user.credentialsExpiryDate',
            name: 'credentials_expiry_date',
            type: 'YearMonthDayInput',
        },
        {
            label: 'label.user.profileComments',
            name: 'profile_comments',
            type: 'TextareaInput',
        },
    ]
});