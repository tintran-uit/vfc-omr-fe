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
  DeploymentUnitOutlined
} from '@ant-design/icons-vue';

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
}

const sidebarItem: menu[] = [
  // { header: 'Dashboard' },
  {
    title: 'mainMenu.myDashboard',
    icon: DashboardOutlined,
    to: '/dashboard',
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
  //   id: 'relating',
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
        to: '/users'
      },
      {
        id: 'users-create',
        title: 'mainMenu.userCreate',
        to: '/users/create'
      }
    ]
  },
  {
    title: 'mainMenu.churches',
    icon: GoldOutlined,
    to: 'components/buttons',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'church-list',
        title: 'mainMenu.churchList',
        to: '/churches'
      },
      {
        id: 'church-create',
        title: 'mainMenu.churchCreate',
        to: '/churches/create'
      }
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
        id: 'default',
        title: 'mainMenu.default',
      },
      {
        id: 'analytics',
        title: 'mainMenu.analytics',
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
