const schemaForm = {
    fields: [
        {
            label: 'Church Name',
            name: 'name',
            rules: 'required',
            type: 'text'
        },
        {
            label: 'Short Name [only 8 characters]',
            name: 'short_name',
            rules: '',
            type: 'Text'
        },
        {
            label: 'Is this an MSC?',
            name: 'is_msc',
            rules: '',
            type: 'YesNoSelect'
        },
        {
            label: 'Enable House C.P.?',
            name: 'enable_cpm',
            rules: '',
            type: 'YesNoSelect'
        },
        {
            label: 'Mother Church',
            name: 'parent_id',
            rules: '',
            type: 'ChurchSelect'
        },
        {
            label: 'Language',
            name: 'language_id',
            rules: '',
            type: 'LanguageSelect'
        },
        {
            label: 'Church Type',
            name: 'church_type_id',
            rules: '',
            type: 'ChurchTypeSelect'
        },
        {
            label: 'Pastor / Assist. Pastor / Admin.',
            name: 'pastor_id',
            rules: '',
            type: 'PastorSelect'
        },
        {
            label: 'Church Network',
            name: 'church_network_id',
            rules: '',
            type: 'ChurchNetworkSelect'
        },

        {
            label: 'Church Apostolic Region',
            name: 'church_region_id',
            rules: '',
            type: 'ChurchRegionSelect'
        },

        {
            label: 'Geographic Mission’s Region',
            name: 'geographical_region_id',
            rules: '',
            type: 'GeographicalRegionSelect'
        },

        {
            label: 'Sensitive Nation?',
            name: 'sensitive_nation',
            rules: '',
            type: 'YesNoSelect',
            default: 'no'
        },

        {
            label: 'Country',
            name: 'country_id',
            rules: '',
            type: 'CountrySelect'
        },

        {
            label: 'Local Currency',
            name: 'currency_id',
            rules: '',
            type: 'CurrencySelect'
        },

        {
            label: 'City / Town / Village',
            name: 'city',
            rules: '',
            type: 'CityInput'
        },

        {
            label: 'Church Picture [Max 1.5MB]',
            name: 'photo',
            rules: '',
            type: 'FileInput'
        },
        {
            label: 'Service Address Street',
            name: 'service_address_street',
            rules: '',
            type: 'TextareaInput'
        },
        {
            label: 'Service Address Postal Code',
            name: 'service_address_postal_code',
            rules: '',
            type: 'TextInput'
        },
        {
            label: 'Mailing Address Street',
            name: 'mailing_address_street',
            rules: '',
            type: 'TextareaInput'
        },
        {
            label: 'Mailing Address Postal Code',
            name: 'mailing_address_postal_code',
            rules: '',
            type: 'TextInput'
        },
        {
            label: 'Office Address Street',
            name: 'office_address_street',
            rules: '',
            type: 'TextareaInput'
        },
        {
            label: 'Office Address Postal Code',
            name: 'office_address_postal_code',
            rules: '',
            type: 'TextInput'
        },
        {
            label: 'Office Phone',
            name: 'office_phone',
            rules: '',
            type: 'TextInput'
        },
        {
            label: 'Office Fax',
            name: 'office_fax',
            rules: '',
            type: 'TextInput'
        },
        {
            label: 'Email Address',
            name: 'email_address',
            rules: '',
            type: 'EmailInput'
        },
        {
            label: 'Website',
            name: 'website',
            rules: '',
            type: 'TextInput'
        },
        {
            label: 'Facebook',
            name: 'facebook',
            rules: '',
            type: 'TextInput'
        },
        {
            label: 'Twitter',
            name: 'twitter',
            rules: '',
            type: 'TextInput'
        },
        {
            label: 'Church\'s Birthday',
            name: 'date_of_birth',
            rules: '',
            type: 'BirthdayPicker'
        },
    ]
}


export default schemaForm;