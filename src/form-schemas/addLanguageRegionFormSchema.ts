export const createFormSchema = () => ({
    name: 'geographicalRegions.addTitle',
    initData: () => ({
        'disabled': false
    }),
    fields: [
        {
            label: 'geographicalRegions.labelParent',
            name: 'parent_id',
            rules: [],
            type: 'LanguageRegionSelectInput'
        },
        {
            label: 'geographicalRegions.labelName',
            name: 'name',
            rules: ['required'],
            type: 'TextInput'
        }
    ]
})