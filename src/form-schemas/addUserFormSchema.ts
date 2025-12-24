export const createFormSchema = () => ({
    name: 'Pastor / Assist. Pastor / Admin. Data',
    // initData: () => ({
    //     username: 'hai01',
    //     password: '123456',
    //     date_of_birth: "2021-01-01",
    //     credentials_expiry_date: "2050-01-01",
    //     sensitive_nation: false,
    //     first_name: 'Hai',
    //     last_name: 'Van',

    //     church_id: 11,
    //     country_id: 231,
    //     langauge_id: 14,
    //     role_id: 3,
    // }),
    fields: [
        {
            label: 'user.labelPrefix',
            name: 'prefix',
            type: 'SelectInput',
            optionName: 'prefixes',
        },
        {
            label: 'user.labelFirstName',
            name: 'first_name',
            rules: ['required'],
            type: 'TextInput'
        },
        {
            label: 'user.labelLastName',
            name: 'last_name',
            type: 'TextInput'
        },
        {
            label: 'user.labelUsername',
            name: 'username',
            description: 'user.infoUsername',
            rules: ['required'],
            type: 'TextInput'
        },
        {
            label: 'user.labelPassword',
            name: 'password',
            description: 'user.infoPassword',
            rules: ['required', 'min:6'],
            type: 'PasswordInput'
        },
        {
            label: 'user.labelTitle',
            name: 'title',
            description: 'user.infoTitle',
            type: 'TextInput'
        },
        {
            label: 'user.labelRole',
            name: 'role_id',
            description: 'user.infoRole',
            rules: ['required'],
            type: 'SelectInput',
            optionName: 'roles',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'user.labelChurch',
            name: 'church_id',
            description: 'user.infoChurch',
            rules: ['required'],
            type: 'ChurchSelectInput',
            optionName: 'churches',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'user.labelUserPhoto',
            name: 'user_photo',
            type: 'PhotoCropperInput',
            initialImageKey: 'photo_url',
            attrs: {
                entity_type: 'users',
                aspectRatio: '1',
                mode: 'avatar'
            }
        },
        {
            label: 'user.labelCountry',
            name: 'country_id',
            rules: ['required'],
            type: 'CountrySelectInput',
        },
        {
            label: 'user.labelSensiveNation',
            name: 'sensitive_nation',
            description: 'user.infoSensitiveNation',
            type: 'YesNoInput',
            defaultValue: false,
        },
        {
            label: 'user.labelLanguage',
            name: 'language_id',
            desciprion: 'user.infoLanguage',
            rules: ['required'],
            type: 'LanguageSelectInput',
        },
        {
            label: 'user.labelMobilePhone',
            name: 'mobile_phone',
        },
        {
            label: 'user.labelEmailAddress',
            name: 'email_address',
        },
        {
            label: 'user.labelCredentials',
            name: 'credentials',
            type: 'SelectInput',
            optionName: 'credentials',
            attrs: {
                mode: 'future'
            }
        },
        {
            label: 'user.labelCredentialsNumber',
            name: 'credentials_number',
            type: 'TextInput'
        },
        {
            label: 'user.labelCredentialsFrom',
            name: 'credentials_from',
            type: 'TextInput'
        },
        {
            label: 'user.labelCredentialsExpiryDate',
            name: 'credentials_expiry_date',
            type: 'YearMonthDayInput',
            attrs: {
                mode: 'future'
            }
        },
        {
            label: 'user.labelProfileComments',
            name: 'profile_comments',
            type: 'TextareaInput',
        },
    ]
})