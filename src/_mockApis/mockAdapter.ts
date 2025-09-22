import AxiosMockAdapter from 'axios-mock-adapter'
import apiClient from '@/services/apiClient'

const mock = new AxiosMockAdapter(apiClient.instance, { delayResponse: 0 });

export default mock;