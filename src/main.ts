import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import '@/scss/style.scss';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import VueApexCharts from 'vue3-apexcharts';
import VueTablerIcons from 'vue-tabler-icons';
import Vue3Marquee from 'vue3-marquee';
import * as Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

// google-fonts
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/700.css';

import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';

// Global component
// import YesNoInput from './components/input/YesNoInput.vue';
import TextInput from './components/input/TextInput.vue';
import SelectInput from './components/input/SelectInput.vue';
import PasswordInput from './components/input/PasswordInput.vue';
import PhotoUploadInput from './components/input/PhotoUploadInput.vue';
import ChurchSelectInput from './components/input/ChurchSelectInput.vue';
import YearMonthDayInput from './components/input/YearMonthDayInput.vue';
import MultiTextInput from './components/input/MultiTextInput.vue';
import YesNoInput from './components/input/YesNoInput.vue';
import TextareaInput from './components/input/TextareaInput.vue';
import CurrencySelectInput from './components/input/CurrencySelectInput.vue'
import ServiceVenueSelectInput from './components/input/ServiceVenueSelectInput.vue'
import GeographicalRegionSelectInput from './components/input/GeographicalRegionSelectInput.vue';
import CityInput from './components/input/CityInput.vue';

//Mock Api data
import './_mockApis';
import { fakeBackend } from '@/utils/helpers/fake-backend';

import { vMaska } from 'maska/vue';
// print
import print from 'vue3-print-nb';

//i18
import { createI18n } from 'vue-i18n';
import messages from '@/utils/locales/messages';

const i18n = createI18n({
  locale: 'en',
  messages: messages,
  silentTranslationWarn: true,
  silentFallbackWarn: true
});

// @ts-expect-error: vue3-easy-data-table doesn't have default export
import DataTable from 'vue3-easy-data-table';


const app = createApp(App);
app.component('TextInput', TextInput)
app.component('SelectInput', SelectInput)
app.component('PasswordInput', PasswordInput)
app.component('ChurchSelectInput', ChurchSelectInput)
app.component('PhotoUploadInput', PhotoUploadInput)
app.component('YearMonthDayInput', YearMonthDayInput)
app.component('MultiTextInput', MultiTextInput)
app.component('YesNoInput', YesNoInput)
app.component('TextareaInput', TextareaInput)
app.component('CurrencySelectInput', CurrencySelectInput)
app.component('ServiceVenueSelectInput', ServiceVenueSelectInput)
app.component('GeographicalRegionSelectInput', GeographicalRegionSelectInput)
app.component('CityInput', CityInput)


fakeBackend();
app.use(router);
app.component('EasyDataTable', DataTable);
app.use(PerfectScrollbarPlugin);
app.use(createPinia());
app.use(VueTablerIcons);
app.use(Antd);
app.use(print);
app.use(Vue3Marquee);
app.use(i18n);
app.directive('maska', vMaska);
app.use(VueApexCharts);
app.use(vuetify).mount('#app');
