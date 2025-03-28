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
  { header: 'Dashboard' },
  {
    title: 'My Dashboard',
    icon: DashboardOutlined,
    to: '/dashboard/default',
    children: [
      {
        id: 'default',
        title: 'Default',
        to: '/dashboard/default'
      },
      {
        id: 'analytics',
        title: 'Analytics',
        to: '/dashboard/analytics'
      }
    ]
  },
  {
    id: 'relating',
    title: 'Enter Report',
    icon: MessageOutlined,
    to: '/test/report-form'
  },
  {
    title: 'Users',
    icon: UserOutlined,
    to: 'components/buttons',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'user-list',
        title: 'List',
      },
      {
        id: 'user-add-new',
        title: 'Add new user',
      }
    ]
  },
  {
    title: 'Churches',
    icon: GoldOutlined,
    to: 'components/buttons',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'church-list',
        title: 'List',
      },
      {
        id: 'church-add-new',
        title: 'Add new church',
      }
    ]
  },
  {
    title: 'Watch List',
    icon: FileTextOutlined,
    to: '#',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'default',
        title: 'Default',
      },
      {
        id: 'analytics',
        title: 'Analytics',
      }
    ]
  },
  {
    title: 'Generate Reports',
    icon: LineChartOutlined,
    to: '#',
    getURL: true,
    type: 'external',
    chipVariant: 'tonal',
    children: [
      {
        id: 'report-church',
        title: 'Church Reports',
      },
      {
        id: 'report-church-status',
        title: 'Churches Reporting Status',
      },
      {
        id: 'report-my-directory',
        title: 'My Directory',
      },
      {
        id: 'report-visit',
        title: 'Visit Reports',
      }
    ]
  },
  {
    id: 'relating',
    title: 'Relating',
    icon: MessageOutlined,
    to: '/app/chats'
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: QuestionOutlined,
    to: '#'
  },
];

export default sidebarItem;
