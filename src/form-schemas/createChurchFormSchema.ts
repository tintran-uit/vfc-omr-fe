import { at } from "lodash";

const schemaForm = {
    initData: () => ({
        is_first_msc: false,
    }),
    fields: [
        {
            label: 'label.church.name',
            name: 'name',
            description: 'fieldDescription.church.name',
            rules: ['required'],
        },
        {
            label: 'label.church.shortName',
            name: 'short_name',
            description: 'fieldDescription.church.shortName',
        },
        {
            label: 'label.church.isMsc',
            name: 'is_msc',
            description: 'fieldDescription.church.isMsc',
            type: 'YesNoInput'
        },
        // {
        //     label: 'label.church.isFirstMsc',
        //     name: 'is_first_msc',
        //     type: 'HiddenInput'
        // }
        {
            label: 'label.church.parent',
            name: 'parent_id',
            description: 'fieldDescription.church.parent',
            type: 'ChurchSelectInput',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'label.church.language',
            name: 'language_id',
            description: 'fieldDescription.church.language',
            rules: ['required'],
            type: 'SelectInput',
            optionName: 'languages',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'label.church.churchType',
            name: 'church_type_id',
            description: 'fieldDescription.church.churchType',
            rules: ['required'],
            type: 'SelectInput',
            optionName: 'types',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'label.church.pastor',
            name: 'pastor_id',
            description: 'fieldDescription.church.pastor',
            rules: ['required'],
            type: 'SelectInput',
            optionName: 'pastor',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'label.church.churchNetwork',
            name: 'church_network_id',
            description: 'fieldDescription.church.churchNetwork',
            rules: ['required'],
            type: 'SelectInput',
            optionName: 'networks',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'label.church.churchRegion',
            name: 'church_region_id',
            description: 'fieldDescription.church.churchRegion',
            rules: ['required'],
            type: 'SelectInput',
            optionName: 'regions',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'Geographic Mission’s Region',
            name: 'geographical_region_id',
            rules: ['required'],
            type: 'GeographicalRegionSelectInput'
        },
        {
            label: 'label.church.sensitiveNation',
            name: 'sensitive_nation',
            desciption: 'fieldDescription.church.sensitiveNation',
            type: 'YesNoInput',
            default: () => false
        },

        {
            label: 'label.church.country',
            name: 'country_id',
            rules: ['required'],
            type: 'SelectInput',
            optionName: 'countries',
            attrs: {
                itemTitle: 'name',
                itemValue: 'id',
            }
        },
        {
            label: 'label.church.currency',
            name: 'currency_id',
            desciption: 'fieldDescription.church.currency',
            rules: ['required'],
            type: 'CurrencySelectInput',
        },
        {
            label: 'label.church.city',
            name: 'city',
            type: 'CityInput'
        },
        {
            label: 'label.church.photo',
            name: 'photo',
            desciption: 'fieldDescription.church.photo',
            type: 'PhotoUploadInput',
            attrs: {
                entity_type: 'churches'
            }
        },
        {
            label: 'label.church.serviceAddressStreet',
            name: 'service_address_street',
            type: 'TextareaInput'
        },
        {
            label: 'label.church.serviceAddressPostalCode',
            name: 'service_address_postal_code',
            type: 'TextInput'
        },
        {
            label: 'label.church.serviceVenue',
            name: 'service_venue',
            description: 'fieldDescription.church.serviceVenue',
            type: 'ServiceVenueSelectInput',
        },
        {
            label: 'label.church.emailAddress',
            name: 'email_address',
            rules: ['required', 'email'],
            type: 'EmailInput'
        },
        {
            label: 'label.church.website',
            name: 'website',
            rules: ['url'],
            desciption: 'fieldDescription.church.website',
            type: 'TextInput'
        },
        {
            label: 'label.church.facebook',
            name: 'facebook',
            rules: ['url'],
            desciption: 'fieldDescription.church.facebook',
            type: 'TextInput'
        },
        {
            label: 'label.church.twitter',
            name: 'twitter',
            rules: ['url'],
            desciption: 'fieldDescription.church.twitter',
            type: 'TextInput'
        },
        {
            label: 'label.church.instagram',
            name: 'instagram',
            rules: ['url'],
            type: 'TextInput'
        },
        {
            label: 'label.church.dateOfBirth',
            name: 'date_of_birth',
            rules: ['required'],
            desciption: 'fieldDescription.church.dateOfBirth',
            type: 'YearMonthDayInput'
        },
    ]
}


export default schemaForm;