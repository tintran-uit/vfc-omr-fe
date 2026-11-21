import { ROLE_PASTOR_LEADER } from '@/constants/roleConstant';
import { holdsMinisterialCredential, NO_MINISTERIAL_CREDENTIAL } from '@/helpers/userCredentials';

const showCredentialDetails = (form: Record<string, unknown>) =>
    holdsMinisterialCredential(form?.credentials);

export const createFormSchema = () => ({
    initData: () => ({
        role_id: ROLE_PASTOR_LEADER,
        sensitive_nation: false,
        credentials: NO_MINISTERIAL_CREDENTIAL,
    }),
    fields: [
        {
            label: 'user.labelUsername',
            name: 'username',
            description: 'user.infoUsername',
            rules: ['required'],
            type: 'TextInput'
        },
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
            defaultValue: ROLE_PASTOR_LEADER,
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'user.labelUserPhoto',
            name: 'user_photo',
            description: 'user.infoUserPhoto',
            type: 'PhotoCropperInput',
            initialImageKey: 'photo_url',
            attrs: {
                entity_type: 'users',
                aspectRatio: '1',
                mode: 'avatar'
            }
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
            label: 'user.labelCountry',
            name: 'country_id',
            rules: ['required'],
            type: 'CountrySelectInput',
        },
        {
            label: 'user.labelEmailAddress',
            name: 'email_address',
            type: 'TextInput',
            readonly: true,
        },
        {
            label: 'user.labelMobilePhone',
            name: 'mobile_phone',
        },
        {
            label: 'user.labelCredentials',
            name: 'credentials',
            type: 'SelectInput',
            optionName: 'credentials',
            default: NO_MINISTERIAL_CREDENTIAL,
        },
        {
            label: 'user.labelCredentialsNumber',
            name: 'credentials_number',
            type: 'TextInput',
            showWhen: showCredentialDetails,
        },
        {
            label: 'user.labelCredentialsFrom',
            name: 'credentials_from',
            type: 'TextInput',
            showWhen: showCredentialDetails,
        },
        {
            label: 'user.labelCredentialsExpiryDate',
            name: 'credentials_expiry_date',
            type: 'YearMonthDayInput',
            showWhen: showCredentialDetails,
        },
    ]
});