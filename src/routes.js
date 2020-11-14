import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Account from './views/nav1/Account.vue'
import Contract from './views/nav1/Contract.vue'
import Company from './views/nav1/Company.vue'
import Member from './views/nav1/Member.vue'
import Project from './views/nav1/Project.vue'
import Team from './views/nav1/Team.vue'
import Leader from './views/nav1/Leader.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Navigation One',
    //     iconCls: 'el-icon-message',//Icon style class
    //     children: [
    //         { path: '/main', component: Main, name: 'Home', hidden: true },
    //         { path: '/table', component: Table, name: 'Table' },
    //         { path: '/form', component: Form, name: 'Form' },
    //         { path: '/user', component: user, name: 'List' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Navigation Two',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: 'Page 4' },
    //         { path: '/page5', component: Page5, name: 'Page 5' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//Only one node
    //     children: [
    //         { path: '/page6', component: Page6, name: 'Navigation Three' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         { path: '/echarts', component: echarts, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,
        children: [
            { path: '/account', component: Account, name: 'Accounts Manager'}
        ]
    },

    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-users',
        leaf: true,
        children: [
            { path: '/team', component: Team, name: 'Teams Manager'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user',
        leaf: true,
        children: [
            { path: '/leader', component: Leader, name: 'Leaders Manager'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-archive',
        leaf: true,
        children: [
            { path: '/project', component: Project, name: 'Projects Manager'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-user-o',
        leaf: true,
        children: [
            { path: '/member', component: Member, name: 'Members Manager'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-handshake-o',
        leaf: true,
        children: [
            { path: '/contract', component: Contract, name: 'Contracts Manager'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-suitcase',
        leaf: true,
        children: [
            { path: '/company', component: Company, name: 'Company List'}
        ]
    },
    
];

export default routes;