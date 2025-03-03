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
    title: 'Dashboard',
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
    title: 'Components',
    icon: GoldOutlined,
    to: 'components/buttons',
    getURL: true,
    type: 'external',
    chip: 'new',
    chipColor: 'primary',
    chipVariant: 'tonal'
  },
  { header: 'Widget' },
  {
    id: 'statistics',
    title: 'Statistics',
    icon: IdcardOutlined,
    to: '/widget/statistics'
  },
  {
    id: 'data',
    title: 'Data',
    icon: DatabaseOutlined,
    to: '/widget/data'
  },
  {
    id: 'chart',
    title: 'Chart',
    icon: LineChartOutlined,
    to: '/widget/chart'
  },
  { header: 'Applications' },
  {
    id: 'chats',
    title: 'Chat',
    icon: MessageOutlined,
    to: '/app/chats'
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: CalendarOutlined,
    to: '/app/calendar'
  },
  {
    id: 'kanban',
    title: 'Kanban',
    icon: BuildOutlined,
    to: '/app/kanban'
  },
  {
    title: 'Customer',
    icon: CustomerServiceOutlined,
    to: '/customer/',
    children: [
      {
        id: 'customerlist',
        title: 'Customer List',
        to: '/customer/customerlist'
      },
      {
        id: 'createcustomer',
        title: 'Create Invoice',
        to: '/app/customer/create-invoice'
      },
      {
        id: 'orderdetails',
        title: 'Order Details',
        to: '/app/customer/order-details'
      },
      {
        id: 'orderlist',
        title: 'Order List',
        to: '/customer/orderlist'
      },
      {
        id: 'productlist',
        title: 'Product List',
        to: '/customer/productlist'
      },
      {
        id: 'productreview',
        title: 'Product Review',
        to: '/customer/productreview'
      }
    ]
  },
  {
    title: 'Invoice',
    icon: FileTextOutlined,
    to: '/',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        to: '/app/invoice/dashboard'
      },
      {
        id: 'create',
        title: 'Create',
        to: '/app/invoice/create'
      },
      {
        id: 'details',
        title: 'Details',
        to: '/app/invoice/details'
      },
      {
        id: 'list',
        title: 'List',
        to: '/app/invoice/list'
      },
      {
        id: 'edit',
        title: 'Edit',
        to: '/app/invoice/edit'
      }
    ]
  },
  {
    title: 'Users',
    icon: UserOutlined,
    to: '/app/user',
    children: [
      {
        id: 'socialprofile',
        title: 'Social Profile',
        to: '/app/user/social/posts'
      },
      {
        title: 'Account Profile',
        to: '/app/user/account-profile',
        children: [
          {
            id: 'profile01',
            title: 'Profile 01',
            to: '/app/user/account-profile/profile1'
          },
          {
            id: 'profile02',
            title: 'Profile 02',
            to: '/app/user/account-profile/profile2'
          },
          {
            id: 'profile03',
            title: 'Profile 03',
            to: '/app/user/account-profile/profile3'
          }
        ]
      },
      {
        id: 'userprofile',
        title: 'User Profile',
        to: '/app/user/userprofile'
      },
      {
        title: 'Cards',
        to: '/app/user/card',
        children: [
          {
            id: 'style01',
            title: 'Style 01',
            to: '/app/user/card/card1'
          },
          {
            id: 'style02',
            title: 'Style 02',
            to: '/app/user/card/card2'
          },
          {
            id: 'style03',
            title: 'Style 03',
            to: '/app/user/card/card3'
          }
        ]
      },
      {
        title: 'List',
        to: '/app/user/list',
        children: [
          {
            id: 'liststyle01',
            title: 'Style 01',
            to: '/app/user/list1'
          },
          {
            id: 'liststyle02',
            title: 'Style 02',
            to: '/app/user/list2'
          }
        ]
      }
    ]
  },
  {
    id: 'mail',
    title: 'Mail',
    icon: MailOutlined,
    to: '/app/mail'
  },
  {
    title: 'Contact',
    icon: PhoneOutlined,
    to: '/app/contacts',
    children: [
      {
        id: 'contactcard',
        title: 'Card',
        to: '/app/contact/c-card'
      },
      {
        id: 'contactlist',
        title: 'List',
        to: '/app/contact/c-list'
      }
    ]
  },
  {
    title: 'E-Commerce',
    icon: ShoppingCartOutlined,
    to: '/ecommerce/',
    children: [
      {
        id: 'products',
        title: 'Products',
        to: '/ecommerce/products'
      },
      {
        id: 'productdetail',
        title: 'Product Detail',
        to: '/ecommerce/product/detail/1'
      },
      {
        id: 'productlist',
        title: 'Product List',
        to: '/ecommerce/productlist'
      },
      {
        id: 'addproduct',
        title: 'Add New Product',
        to: '/ecommerce/add-product'
      },
      {
        id: 'checkout',
        title: 'Checkout',
        to: '/ecommerce/checkout'
      }
    ]
  },
  { header: 'Forms' },
  {
    title: 'Plugins',
    icon: CloudUploadOutlined,
    to: '/forms/radio',
    children: [
      {
        id: 'editor',
        title: 'Editor',
        to: '/forms/plugins/editor'
      },
      {
        id: 'mask',
        title: 'Mask',
        to: '/forms/plugins/mask'
      },
      {
        id: 'captchalogin',
        title: 'Captcha',
        to: '/captcha'
      },
      {
        id: 'dropzone',
        title: 'Dropzone',
        to: '/forms/plugins/dropzone',
        chip: 'new',
        chipColor: 'primary',
        chipVariant: 'tonal'
      },
      {
        id: 'clipboard',
        title: 'Clipboard',
        to: '/forms/plugins/clipboard'
      }
    ]
  },

  {
    title: 'Layouts',
    icon: FormOutlined,
    to: '/forms/layouts',
    children: [
      {
        id: 'layouts',
        title: 'Layouts',
        to: '/forms/layouts/layouts'
      },
      {
        id: 'multicolumns',
        title: 'Multi Columns Form',
        to: '/forms/layouts/multi-column-forms'
      },
      {
        id: 'actionbar',
        title: 'Action Bar',
        to: '/forms/layouts/action-bar'
      },
      {
        id: 'stickyactionbar',
        title: 'Sticky Action Bar',
        to: '/forms/layouts/sticky-action-bar'
      }
    ]
  },
  {
    title: 'Tables',
    icon: TableOutlined,
    to: '/forms/tables',
    children: [
      {
        id: 'basictable',
        title: 'Basic Table',
        to: '/tables/tbl-basic'
      },
      {
        id: 'darktable',
        title: 'Dark Table',
        to: '/tables/tbl-dark'
      },
      {
        id: 'densitytable',
        title: 'Density Table',
        to: '/tables/tbl-density'
      },
      {
        id: 'heighttable',
        title: 'Height Table',
        to: '/tables/tbl-height'
      },
      {
        id: 'fixedheadertable',
        title: 'Fixed Header Table',
        to: '/tables/tbl-fixed-header'
      }
    ]
  },
  {
    title: 'Charts',
    icon: PieChartOutlined,
    to: '/forms/radio',
    children: [
      {
        id: 'orgchart',
        title: 'Org Charts',
        to: '/forms/charts/orgchart'
      },
      {
        id: 'apexchart',
        title: 'Apex Charts',
        to: '/forms/charts/apexchart'
      }
    ]
  },
  {
    id: 'formvalidation',
    title: 'Form Validation',
    icon: FileDoneOutlined,
    to: '/forms/formvalidation'
  },
  { header: 'Utilities' },
  {
    title: 'Icons',
    icon: CrownOutlined,
    to: '/forms/radio',
    children: [
      {
        id: 'antdesign',
        title: 'Ant design Icons',
        to: '/icons/ant'
      },
      {
        id: 'tablericon',
        title: 'Tabler Icons',
        to: '/icons/tabler'
      },
      {
        id: 'materialicon',
        title: 'Material Icons',
        to: '/icons/material'
      }
    ]
  },
  { divider: true },
  { header: 'Pages' },
  {
    title: 'Authentication',
    icon: LoginOutlined,
    to: '/auth',
    children: [
      {
        id: 'login',
        title: 'Login',
        to: '/login1'
      },
      {
        id: 'register',
        title: 'Register',
        to: '/register1'
      },
      {
        id: 'forgotpassword',
        title: 'Forgot Password',
        to: '/forgot-pwd1'
      },
      {
        id: 'checkmail',
        title: 'Check Mail',
        to: '/check-mail1'
      },
      {
        id: 'resetpassword',
        title: 'Reset Password',
        to: '/reset-pwd1'
      },
      {
        id: 'codeverification',
        title: 'Code Verification',
        to: '/code-verify1'
      }
    ]
  },
  {
    id: 'pricing',
    title: 'Pricing',
    icon: DollarOutlined,
    to: '/pages/pricing1'
  },
  {
    title: 'Maintenance',
    icon: RocketOutlined,
    to: '/maintenenace',
    children: [
      {
        id: 'error404',
        title: 'Error 404',
        to: '/error'
      },
      {
        id: 'error500',
        title: 'Error 500',
        to: '/error500'
      },
      {
        id: 'comingsoon',
        title: 'Coming soon',
        to: '/comingsoon1'
      },
      {
        id: 'underconstruction',
        title: 'Under Construction',
        to: '/construction'
      }
    ]
  },
  {
    id: 'landing',
    title: 'Landing page',
    icon: BellOutlined,
    getURL: true,
    to: '',
    type: 'external'
  },
  {
    id: 'contactus',
    title: 'Contact Us',
    icon: PhoneOutlined,
    getURL: true,
    to: 'contact-us',
    type: 'external'
  },
  {
    id: 'faqs',
    title: 'FAQs',
    icon: QuestionOutlined,
    getURL: true,
    to: 'faq',
    type: 'external'
  },
  {
    id: 'privacypolicy',
    title: 'Privacy Policy',
    icon: LockOutlined,
    getURL: true,
    to: 'privacy-policy',
    type: 'external'
  },
  { divider: true },
  { header: 'Others' },
  {
    title: 'Menu levels',
    icon: MenuUnfoldOutlined,
    to: '#',
    children: [
      {
        id: 'menulevel1',
        title: 'Level 1',
        disabled: true,
        to: '/level1'
      },
      {
        id: 'menulevel2',
        title: 'Level 1',
        children: [
          {
            id: 'level2',
            title: 'Level 2',
            disabled: true,
            to: '/level2'
          },
          {
            id: 'childlevel2',
            title: 'Level 2',
            children: [
              {
                id: 'level3',
                title: 'Level 3',
                disabled: true,
                to: '/level3'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'subcaption',
    title: 'Sub Caption',
    icon: BoxPlotOutlined,
    subCaption: 'caption title',
    to: ''
  },
  {
    id: 'disabledmenu',
    title: 'Disabled Menu',
    icon: StopOutlined,
    disabled: true,
    to: '/diabled'
  },
  {
    id: 'sample',
    title: 'Sample Page',
    icon: ChromeOutlined,
    to: '/starter'
  },
  {
    id: 'document',
    title: 'Documentation',
    icon: QuestionOutlined,
    to: 'https://codedthemes.gitbook.io/mantis-vuetify/',
    type: 'external',
    chip: 'gitbook',
    chipColor: 'secondary',
    chipVariant: 'flat'
  },
  {
    id: 'roadmap',
    title: 'Road Map',
    icon: DeploymentUnitOutlined,
    to: 'https://codedthemes.gitbook.io/mantis-vuetify/roadmap',
    type: 'external'
  }
];

export default sidebarItem;
