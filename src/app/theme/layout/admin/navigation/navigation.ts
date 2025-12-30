export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
  roles?: string[]; // 👈 AJOUT IMPORTANT
}

export const NavigationItems: NavigationItem[] = [
  {
  id: 'navigation',
  title: 'Navigation',
  type: 'group',
  icon: 'icon-group',
  children: [
    {
      id: 'dashboard-admin',
      title: 'Tableau de bord',
      type: 'item',
      url: '/analytics',         // Dashboard ResponsableSAV
      icon: 'feather icon-home',
      roles: ['ResponsableSAV']
    },
    {
      id: 'dashboard-client',
      title: 'Tableau de bord',
      type: 'item',
      url: '/client-dashboard',  // Dashboard Client
      icon: 'feather icon-home',
      roles: ['Client']
    }
  ]
},
  /*
  {
    id: 'ui-component',
    title: 'Ui Component',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/component/button'
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/component/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/component/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/component/collapse'
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/component/tabs-pills'
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/component/typography'
          }
        ]
      }
    ]
  },*/

  /*
  {
    id: 'chart',
    title: 'Chart',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'apexchart',
        title: 'ApexChart',
        type: 'item',
        url: '/chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      }
    ]
  },*/
  {
    id: 'forms & tables',
    title: 'Gestion',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'tables',
        title: 'clients',
        type: 'item',
        url: '/GestionClients',
        classes: 'nav-item',
        icon: 'feather icon-user',
        roles: ['ResponsableSAV']
      },
        {
        id: 'tables',
        title: 'réclamations',
        type: 'item',
        url: '/GestionReclamations',
        classes: 'nav-item',
        icon: 'feather icon-server',
        roles: ['ResponsableSAV']
      },
        {
        id: 'tables',
        title: 'articles',
        type: 'item',
        url: '/GestionArticles',
        classes: 'nav-item',
        icon: 'feather icon-server',
        roles: ['ResponsableSAV']
      },
      {
        id: 'tables',
        title: 'techniciens',
        type: 'item',
        url: '/techniciens',
        classes: 'nav-item',
        icon: 'feather icon-server',
        roles: ['ResponsableSAV']
      },
        {
        id: 'tables',
        title: 'interventions',
        type: 'item',
        url: '/interventions',
        classes: 'nav-item',
        icon: 'feather icon-server',
        roles: ['ResponsableSAV']
      }
      ,
        {
        id: 'tables',
        title: 'Mes réclamations',
        type: 'item',
        url: '/MesReclamations',
        classes: 'nav-item',
        icon: 'feather icon-server',
         roles: ['Client']
      }
       ,
        {
        id: 'tables',
        title: 'Nouvelle réclamation',
        type: 'item',
        url: '/AddReclamation',
        classes: 'nav-item',
        icon: 'feather icon-server',
        roles: ['Client']
      }
      ,
        {
        id: 'tables',
        title: 'mes articles',
        type: 'item',
        url: '/MesArticles',
        classes: 'nav-item',
        icon: 'feather icon-server',
        roles: ['Client']
      }
    ]
  },
    {
    id: 'Authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'signup',
        title: 'Inscription',
        type: 'item',
        url: '/register',
        icon: 'feather icon-at-sign',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'signin',
        title: 'Connexion',
        type: 'item',
        url: '/login',
        icon: 'feather icon-log-in',
        target: true,
        breadcrumbs: false
      }
    ]
  },
  
  
  /*
  {
    id: 'other',
    title: 'Other',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'sample-page',
        title: 'Sample Page',
        type: 'item',
        url: '/sample-page',
        classes: 'nav-item',
        icon: 'feather icon-sidebar'
      },
      {
        id: 'menu-level',
        title: 'Menu Levels',
        type: 'collapse',
        icon: 'feather icon-menu',
        children: [
          {
            id: 'menu-level-2.1',
            title: 'Menu Level 2.1',
            type: 'item',
            url: 'javascript:',
            external: true
          },
          {
            id: 'menu-level-2.2',
            title: 'Menu Level 2.2',
            type: 'collapse',
            children: [
              {
                id: 'menu-level-2.2.1',
                title: 'Menu Level 2.2.1',
                type: 'item',
                url: 'javascript:',
                external: true
              },
              {
                id: 'menu-level-2.2.2',
                title: 'Menu Level 2.2.2',
                type: 'item',
                url: 'javascript:',
                external: true
              }
            ]
          }
        ]
      }
    ]
  }*/
];
