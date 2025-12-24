export const createFormSchema = () => ({
    name: "Church Data",
    initData: () => ({
        is_first_msc: false,
    }),
    fields: [
        {
            label: 'church.labelName',
            name: 'name',
            description: 'church.infoName',
            placeholder: 'church.phName',
            rules: ['required'],
        },
        {
            label: 'church.labelShortName',
            name: 'short_name',
            rules: ['max:10'],
            description: 'church.infoShortName',
            placeholder: 'church.phShortName'
        },
        {
            label: 'church.labelIsMsc',
            name: 'is_msc',
            type: 'YesNoInput'
        },
        {
            label: 'church.labelParent',
            name: 'parent_id',
            type: 'ChurchSelectInput',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'church.labelLanguage',
            name: 'language_id',
            rules: ['required'],
            type: 'LanguageSelectInput',
        },
        {
            label: 'church.labelChurchType',
            name: 'church_type_id',
            description: 'church.infoChurchType',
            rules: ['required'],
            type: 'ChurchTypeSelectInput',
        },
        {
            label: 'church.labelPastor',
            name: 'pastor_id',
            description: 'church.infoPastor',
            rules: ['required'],
            type: 'PastorSelectInput',
        },
        {
            label: 'church.labelChurchNetwork',
            name: 'church_network_id',
            description: 'church.infoChurchNetwork',
            rules: ['required'],
            type: 'ChurchNetworkSelectInput',
        },
        {
            label: 'church.labelChurchRegion',
            name: 'church_region_id',
            description: 'church.infoChurchRegion',
            rules: ['required'],
            type: 'ChurchRegionSelectInput',
        },
        {
            label: 'church.labelGeographicalRegion',
            name: 'geographical_region_id',
            rules: ['required'],
            type: 'GeographicalRegionSelectInput'
        },
        {
            label: 'church.labelSensitiveNation',
            name: 'sensitive_nation',
            desciption: 'church.infoSensitiveNation',
            type: 'YesNoInput',
            default: () => false
        },

        {
            label: 'church.labelCountry',
            name: 'country_id',
            rules: ['required'],
            type: 'CountrySelectInput',
        },
        {
            label: 'church.labelCurrency',
            name: 'currency_id',
            desciption: 'church.infoCurrency',
            rules: ['required'],
            type: 'CurrencySelectInput',
        },
        {
            label: 'church.labelCity',
            name: 'city_id',
            type: 'CitySelectInput'
        },
        {
            label: 'church.labelPhoto',
            name: 'photo',
            desciption: 'church.infoPhoto',
            type: 'PhotoCropperInput',
            attrs: {
                entity_type: 'churches',
                aspectRatio: 16 / 9,
                mode: 'cover'
            }
        },
        {
            label: 'church.labelServiceAddressStreet',
            name: 'service_address_street',
            type: 'TextareaInput'
        },
        {
            label: 'church.labelServiceAddressPostalCode',
            name: 'service_address_postal_code',
            type: 'TextInput'
        },
        {
            label: 'church.labelServiceVenue',
            name: 'service_venue',
            description: 'church.infoServiceVenue',
            type: 'ServiceVenueSelectInput',
        },
        {
            label: 'church.labelEmailAddress',
            name: 'email_address',
            rules: ['required', 'email'],
            type: 'EmailInput'
        },
        {
            label: 'church.labelWebsite',
            name: 'website',
            rules: ['url'],
            desciption: 'church.infoWebsite',
            type: 'TextInput'
        },
        {
            label: 'church.labelFacebook',
            name: 'facebook',
            rules: ['url'],
            desciption: 'church.infoFacebook',
            type: 'TextInput'
        },
        {
            label: 'church.labelTwitter',
            name: 'twitter',
            rules: ['url'],
            desciption: 'church.infoTwitter',
            type: 'TextInput'
        },
        {
            label: 'church.labelInstagram',
            name: 'instagram',
            rules: ['url'],
            type: 'TextInput'
        },
        {
            label: 'church.labelDateOfBirth',
            name: 'date_of_birth',
            rules: ['required'],
            desciption: 'church.infoDateOfBirth',
            type: 'YearMonthDayInput'
        },
    ]
})