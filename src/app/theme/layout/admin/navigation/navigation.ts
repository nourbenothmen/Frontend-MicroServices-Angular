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
        url: '/analytics',
        icon: 'feather icon-home',           // 🏠
        roles: ['ResponsableSAV']
      },
      {
        id: 'dashboard-client',
        title: 'Tableau de bord',
        type: 'item',
        url: '/client-dashboard',
        icon: 'feather icon-home',
        roles: ['Client']
      }
    ]
  },
  {
    id: 'gestion',
    title: 'Gestion',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'clients',
        title: 'Clients',
        type: 'item',
        url: '/GestionClients',
        icon: 'feather icon-users',          // 👥
        roles: ['ResponsableSAV']
      },
      {
        id: 'reclamations',
        title: 'Réclamations',
        type: 'item',
        url: '/GestionReclamations',
        icon: 'feather icon-alert-circle',   // ⚠️
        roles: ['ResponsableSAV']
      },
      {
        id: 'articles',
        title: 'Articles',
        type: 'item',
        url: '/GestionArticles',
        icon: 'feather icon-package',        // 📦
        roles: ['ResponsableSAV']
      },
      {
        id: 'techniciens',
        title: 'Techniciens',
        type: 'item',
        url: '/techniciens',
        icon: 'feather icon-users',           // 🔧
        roles: ['ResponsableSAV']
      },
      {
        id: 'interventions',
        title: 'Interventions',
        type: 'item',
        url: '/interventions',
        icon: 'feather icon-list',         // 🔧
        roles: ['ResponsableSAV']
      },
      // Client
      {
        id: 'mes-reclamations',
        title: 'Mes réclamations',
        type: 'item',
        url: '/MesReclamations',
        icon: 'feather icon-file-text',      // 📄
        roles: ['Client']
      },
      {
        id: 'nouvelle-reclamation',
        title: 'Nouvelle réclamation',
        type: 'item',
        url: '/AddReclamation',
        icon: 'feather icon-plus-circle',    // ➕
        roles: ['Client']
      },
      {
        id: 'mes-articles',
        title: 'Mes articles',
        type: 'item',
        url: '/MesArticles',
        icon: 'feather icon-box',            // 📦
        roles: ['Client']
      }
    ]
  },
  {
    id: 'authentication',
    title: 'Authentication',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'register',
        title: 'Inscription',
        type: 'item',
        url: '/register',
        icon: 'feather icon-user-plus',
        target: true,
        breadcrumbs: false
      },
      {
        id: 'login',
        title: 'Connexion',
        type: 'item',
        url: '/login',
        icon: 'feather icon-log-in',
        target: true,
        breadcrumbs: false
      }
    ]
  }
];
