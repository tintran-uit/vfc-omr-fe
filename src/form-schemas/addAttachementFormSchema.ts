export const createFormSchema = () => ({
    name: "Church Data",
    initData: () => ({
        is_first_msc: false,
    }),
    fields: [
        {
            label: 'attachment.labelFile',
            name: 'name',
            rules: ['required'],
        },
        {
            label: 'attachment.labelName',
            name: 'name',
        },
    ]
})