// icons
import {
  DashboardOutlined,
  UserOutlined,
  GlobalOutlined,
  FlagOutlined,
  ClusterOutlined,
  AppstoreOutlined,
  EnvironmentOutlined,
  CompassOutlined,
  HomeOutlined,
  CalendarOutlined
} from "@ant-design/icons-vue";
import churchIcon from "@/assets/images/icons/house.png";
import peopleIcon from "@/assets/images/metrics/people.svg";

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
    id: "dashboard",
    title: "mainMenu.myDashboard",
    icon: DashboardOutlined,
    to: "/",
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
    title: "mainMenu.users",
    icon: UserOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "users-list",
        title: "mainMenu.userList",
        to: "/users",
        permissions: ["user.read"],
      },
      {
        id: "users-overseer-list",
        title: "mainMenu.overseers",
        to: "/users/overseers",
        permissions: ["user.read-overseer"],
      },
      {
        id: "users-add",
        title: "mainMenu.userAdd",
        to: "/users/add",
        permissions: ["user.create"],
      },
      {
        id: "users-churches-add",
        title: "mainMenu.churchAddWithPastor",
        to: "/churches/add-with-new-pastor",
        permissions: ["user.create", "church.create"],
      },
    ],
  },
  {
    title: "mainMenu.churches",
    icon: HomeOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "church-list",
        title: "mainMenu.churchList",
        to: "/churches",
        permissions: ["church.read"],
      },
      {
        id: "church-add",
        title: "mainMenu.churchAdd",
        to: "/churches/add",
        permissions: ["church.create"],
      },
      {
        id: "church-add-with-pastor",
        title: "mainMenu.churchAddWithPastor",
        to: "/churches/add-with-new-pastor",
        permissions: ["user.create", "church.create"],
      },
      {
        id: "church-disabeded-list",
        title: "mainMenu.disabledChurches",
        to: "/churches/disabled-list",
        permissions: ["church.enable"],
      },
    ],
  },
  {
    title: "mainMenu.churchPlantingProjections",
    icon: CalendarOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "church-planting-add",
        title: "mainMenu.churchPlantingAddProjections",
        to: "/planting-projections/add",
        permissions: ["church-planting.create"],
      },
      {
        id: "church-planting-view",
        title: "mainMenu.churchPlantingViewProjections",
        to: "/planting-projections",
        permissions: ["church-planting.read"],
      },
      {
        id: "church-planting-print",
        title: "mainMenu.churchPlantingPrintProjections",
        subCaption: "mainMenu.churchPlantingPrintSimpleSub",
        to: "/planting-projections/print",
        permissions: ["church-planting.print"],
      },
      {
        id: "church-planting-print-preview",
        title: "mainMenu.churchPlantingPrintPreviewProjections",
        to: "/planting-projections/print/preview",
        permissions: ["church-planting.print-preview"],
      },
    ],
  },
  {
    title: "mainMenu.churchNetworks",
    icon: ClusterOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "church-networks-list",
        title: "mainMenu.churchNetworksList",
        to: "/church-networks",
        permissions: ["church-networks.read"],
      },
      {
        id: "church-networks-add",
        title: "mainMenu.churchNetworksAdd",
        to: "/church-networks/add",
        permissions: ["church-networks.create"],
      },
    ],
  },
  {
    title: "mainMenu.churchTypes",
    icon: AppstoreOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "church-types-list",
        title: "mainMenu.churchTypesList",
        to: "/church-types",
        permissions: ["church-types.read"],
      },
      {
        id: "church-types-add",
        title: "mainMenu.churchTypesAdd",
        to: "/church-types/add",
        permissions: ["church-types.create"],
      },
    ],
  },
  {
    title: "mainMenu.churchRegions",
    icon: EnvironmentOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "church-regions-list",
        title: "mainMenu.list",
        to: "/church-regions",
        permissions: ["church-regions.read"],
      },
      {
        id: "church-regions-add",
        title: "mainMenu.addNew",
        to: "/church-regions/add",
        permissions: ["church-regions.create"],
      },
    ],
  },
  {
    title: "mainMenu.geographicalRegions",
    icon: CompassOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "geographical-regions-list",
        title: "mainMenu.list",
        to: "/geographical-regions",
        permissions: ["geographical-regions.read"],
      },
      {
        id: "geographical-regions-add",
        title: "mainMenu.addNew",
        to: "/geographical-regions/add",
        permissions: ["geographical-regions.create"],
      },
    ],
  },
  {
    title: "mainMenu.languageRegions",
    icon: GlobalOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "language-regions-list",
        title: "mainMenu.list",
        to: "/language-regions",
        permissions: ["language-regions.read"],
      },
      {
        id: "language-regions-add",
        title: "mainMenu.addNew",
        to: "/language-regions/add",
        permissions: ["language-regions.create"],
      },
    ],
  },
  {
    title: "mainMenu.countries",
    icon: FlagOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "countries-list",
        title: "mainMenu.list",
        to: "/countries",
        permissions: ["countries.read"],
      },
      {
        id: "countries-add",
        title: "mainMenu.addNew",
        to: "/countries/add",
        permissions: ["countries.create"],
      },
    ],
  },
  {
    title: "mainMenu.languages",
    icon: GlobalOutlined,
    to: "#",
    getURL: true,
    type: "external",
    chipVariant: "tonal",
    children: [
      {
        id: "languages-list",
        title: "mainMenu.list",
        to: "/languages",
        permissions: ["languages.read"],
      },
      {
        id: "languages-add",
        title: "mainMenu.addNew",
        to: "/languages/add",
        permissions: ["languages.create"],
      },
    ],
  },
  // {
  //   title: 'mainMenu.watchList',
  //   icon: FileTextOutlined,
  //   to: '#',
  //   getURL: true,
  //   type: 'external',
  //   chipVariant: 'tonal',
  //   children: [
  //     {
  //       id: 'watch-list-list',
  //       title: 'mainMenu.watchListList',
  //       permissions: ['watch-list.read']
  //     },
  //     {
  //       id: 'watch-list-add',
  //       title: 'mainMenu.watchListAdd',
  //       permissions: ['watch-list.create']
  //     },
  //     {
  //       id: 'watch-list-generate-reports',
  //       title: 'mainMenu.watchListGenerateReports',
  //       permissions: ['watch-list.report']
  //     }
  //   ]
  // },
  // {
  //   title: 'mainMenu.generateReports',
  //   icon: LineChartOutlined,
  //   to: '#',
  //   getURL: true,
  //   type: 'external',
  //   chipVariant: 'tonal',
  //   children: [
  //     {
  //       id: 'report-church',
  //       title: 'mainMenu.churchReport',
  //     },
  //     {
  //       id: 'report-church-status',
  //       title: 'mainMenu.churchReportingStatus',
  //     },
  //     {
  //       id: 'report-my-directory',
  //       title: 'mainMenu.myDirectory',
  //     },
  //     {
  //       id: 'report-visit',
  //       title: 'mainMenu.visitReports',
  //     }
  //   ]
  // },
  // {
  //   id: 'relating',
  //   title: 'mainMenu.relating',
  //   icon: MessageOutlined,
  // },
  // {
  //   id: 'faq',
  //   title: 'mainMenu.faq',
  //   icon: QuestionOutlined,
  // },
];

export default sidebarItem;
