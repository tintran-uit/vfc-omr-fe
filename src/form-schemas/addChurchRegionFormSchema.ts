export const createFormSchema = () => ({
    name: 'churchRegions.addTitle',
    initData: () => ({
        'disabled': false
    }),
    fields: [
        {
            label: 'churchRegions.labelParent',
            name: 'parent_id',
            rules: [],
            type: 'ChurchRegionSelectInput'
        },
        {
            label: 'churchRegions.labelName',
            name: 'name',
            rules: ['required'],
            type: 'TextInput'
        },
        {
            label: 'churchRegions.labelLogo',
            name: 'logo_path',
            rules: [],
            type: 'PhotoCropperInput',
            initialImageKey: 'logo_url',
            attrs: {
                entity_type: 'churchRegions'
            }
        }
    ]
})