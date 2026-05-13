/**
 * Form “Core Information” for editing a church planting projection.
 * Field order aligned with the production UI (town → country → pop → distance → names → dates).
 */
export const createEditChurchPlantingProjectionFormSchema = () => ({
  initData: () => ({
    town: '',
    country_id: null as number | null,
    population: null as number | null,
    distance_to_town: '',
    distance_to_town_unit: 'km',
    proposed_church_name: '',
    proposed_leader_name: '',
    start_date_preparation: null as string | null,
    start_date_pioneering: null as string | null,
  }),
  fields: [
    {
      label: 'churchPlantingProjection.labelTownCity',
      name: 'town',
      description: 'churchPlantingProjection.infoTownCity',
      rules: ['required'],
      type: 'TextInput',
    },
    {
      label: 'churchPlantingProjection.labelNation',
      name: 'country_id',
      description: 'churchPlantingProjection.infoNation',
      rules: ['required'],
      type: 'CountrySelectInput',
    },
    {
      label: 'churchPlantingProjection.labelTownCityPopulation',
      name: 'population',
      description: 'churchPlantingProjection.infoTownCityPopulation',
      type: 'NumberFormattedInput',
    },
    {
      label: 'churchPlantingProjection.labelDistanceToTown',
      name: 'distance_to_town',
      description: 'churchPlantingProjection.infoDistanceToTown',
      cols: {
        cols: 6,
        md: 3
      },
      type: 'TextInput',
    },
    {
      label: 'churchPlantingProjection.labelDistanceToTownUnit',
      name: 'distance_to_town_unit',
      type: 'SelectInput',
      optionName: 'distanceUnits',
      cols: {
        cols: 6,
        md: 3
      },
      attrs: {
        itemTitle: 'title',
        itemValue: 'value',
      },
    },
    {
      label: 'churchPlantingProjection.labelProposedChurchName',
      name: 'proposed_church_name',
      description: 'churchPlantingProjection.infoProposedChurchName',
      rules: ['required'],
      type: 'TextInput',
    },
    {
      label: 'churchPlantingProjection.labelProposedLeaderName',
      name: 'proposed_leader_name',
      description: 'churchPlantingProjection.infoProposedLeader',
      rules: ['required'],
      type: 'TextInput',
    },
    {
      label: 'churchPlantingProjection.labelStartDatePreparation',
      name: 'start_date_preparation',
      description: 'churchPlantingProjection.infoStartDatePreparation',
      type: 'YearMonthDayInput',
      attrs: {
        density: 'compact',
        mode: 'range',
        minYear: 1990,
        maxYear: new Date().getFullYear() + 5,
      },
    },
    {
      label: 'churchPlantingProjection.labelStartDateForActualPioneering',
      name: 'start_date_pioneering',
      description: 'churchPlantingProjection.infoStartDateActualPioneering',
      type: 'YearMonthDayInput',
      attrs: {
        density: 'compact',
        mode: 'range',
        minYear: 1990,
        maxYear: new Date().getFullYear() + 5,
      },
    },
  ],
});
