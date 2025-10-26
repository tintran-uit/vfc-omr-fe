// icons
import {
  DashboardOutlined,
  IdcardOutlined,
  DatabaseOutlined,
  LineChartOutlined,
  MessageOutlined,
  CalendarOutlined,
  BuildOutlined,
  CustomerServiceOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
  PhoneOutlined,
  GoldOutlined,
  CloudUploadOutlined,
  FormOutlined,
  TableOutlined,
  PieChartOutlined,
  FileDoneOutlined,
  LoginOutlined,
  DollarOutlined,
  RocketOutlined,
  BellOutlined,
  QuestionOutlined,
  LockOutlined,
  CrownOutlined,
  MenuUnfoldOutlined,
  StopOutlined,
  BoxPlotOutlined,
  ChromeOutlined,
  DeploymentUnitOutlined,
  BankOutlined,
  PlusOutlined,
  OrderedListOutlined,
} from '@ant-design/icons-vue';

import {
  mdiChurch,
  mdiChurchOutline,
  mdiAccountGroup,
  mdiChartLine,
  mdiLogout,
  mdiPlusCircleOutline,
  mdiSquareEditOutline,
  mdiChartBar
} from '@mdi/js';

export interface menu {
  id?: string;
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  getURL?: boolean;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  permissions?: string[];
}

const sidebarItem: menu[] = [
  // { header: 'Dashboard' },
  {
    id: 'dashboard',
    title: 'mainMenu.myDashboard',
    icon: DashboardOutlined,
    to: '/',
    // children: [
    //   {
    //     id: 'default',
    //     title: 'Default',
    //     to: '/dashboard/default'
    //   },
    //   {
    //     id: 'analytics',
    //     title: 'Analytics',
    //     to: '/dashboard/analytics'
    //   }
    // ]
  },
  // {
  //   id: 'my-church-profile',
  //   title: 'Enter Report',
  //   icon: MessageOutlined,
  //   to: '/test/report-form'
  // },
  {
    title: 'mainMenu.users',
    icon: UserOutlined,
    to: 'components/buttons',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'users-list',
        title: 'mainMenu.userList',
        to: '/users',
        permissions: ['user.read']
      },
      {
        id: 'users-overseer-list',
        title: 'Overseers',
        to: '/users/overseers',
        permissions: ['user.read-overseer'],
      },
      {
        id: 'users-add',
        title: 'mainMenu.userAdd',
        to: '/users/create',
        permissions: ['user.create'],
      },
      {
        id: 'users-churches-add',
        title: 'mainMenu.churchAddWithPastor',
        to: '/churches/add-with-new-pastor',
        permissions: ['user.create', 'church.create'],
      }
    ]
  },
  {
    title: 'mainMenu.churches',
    icon: BankOutlined,
    to: 'components/buttons',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'church-list',
        title: 'mainMenu.churchList',
        to: '/churches',
        permissions: ['church.read']
      },
      {
        id: 'church-add',
        title: 'mainMenu.churchAdd',
        to: '/churches/add',
        permissions: ['church.create'],
      },
      {
        id: 'church-add-with-pastor',
        title: 'mainMenu.churchAddWithPastor',
        to: '/churches/add-with-new-pastor',
        permissions: ['user.create', 'church.create'],
      },
      {
        id: 'church-disabeded-list',
        title: 'Disabled Churches',
        to: '/churches/disabled-list',
        permissions: ['church.enable'],
      },
    ]
  },
  {
    title: 'mainMenu.watchList',
    icon: FileTextOutlined,
    to: '#',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'watch-list-list',
        title: 'mainMenu.watchListList',
        permissions: ['watch-list.read']
      },
      {
        id: 'watch-list-add',
        title: 'mainMenu.watchListAdd',
        permissions: ['watch-list.add']
      },
      {
        id: 'watch-list-generate-reports',
        title: 'mainMenu.watchListGenerateReports',
        permissions: ['watch-list.report']
      }
    ]
  },
  {
    title: 'mainMenu.generateReports',
    icon: LineChartOutlined,
    to: '#',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'report-church',
        title: 'mainMenu.churchReport',
      },
      {
        id: 'report-church-status',
        title: 'mainMenu.churchReportingStatus',
      },
      {
        id: 'report-my-directory',
        title: 'mainMenu.myDirectory',
      },
      {
        id: 'report-visit',
        title: 'mainMenu.visitReports',
      }
    ]
  },
  {
    id: 'relating',
    title: 'mainMenu.relating',
    icon: MessageOutlined,
  },
  {
    id: 'faq',
    title: 'mainMenu.faq',
    icon: QuestionOutlined,
  },
];

export default sidebarItem;
