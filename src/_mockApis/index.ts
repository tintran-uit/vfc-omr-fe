import mock from './mockAdapter';

import './customers';
import './chat';
import './ecommerce';
import './contact';
import './mail';
import './kanban';
import './weekly-report/weeklyReport';
import './images/images';
import './users/list'


mock.onAny().passThrough();
