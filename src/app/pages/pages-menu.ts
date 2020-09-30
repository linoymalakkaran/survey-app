import { NbMenuItem } from '@nebular/theme';
import { environment } from '../../environments/environment';

let MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'MG Survey',
  //   home: true,
  //   group: true,
  // },
  {
    title: 'Survey',
    icon: { icon: 'book-open-outline', pack: 'eva' },
    link: '/survey/list'
  },
  {
    title: 'Submissions',
    icon: 'browser-outline',
    link: '/survey/submission/list',
  },
];

let DEV_MENU_ITEMS: NbMenuItem[] = [
//   {
//   title: 'Test Page',
//   icon: 'browser-outline',
//   link: '/portal/test',
// },
  // {
  //   title: 'Platform',
  //   group: true,
  // },
  // {
  //   title: 'Settings',
  //   icon: 'settings-2-outline', 
  //   children: [
  //     {
  //       title: 'Access Management',
  //       icon:"browser-outline",
  //       link: 'configuration/accessmanagement'
  //     }
  //   ]
  // }
];

MENU_ITEMS = environment.production ? MENU_ITEMS : [...MENU_ITEMS, ...DEV_MENU_ITEMS]

export { MENU_ITEMS };
