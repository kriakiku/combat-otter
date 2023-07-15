import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdKeyboardarrowleftRound, MdKeyboardarrowrightRound, MdScreenshotmonitor  } from "oh-vue-icons/icons/md";
import { SiDiscord, SiObsstudio  } from "oh-vue-icons/icons/si";
import { OiBlocked  } from "oh-vue-icons/icons/oi";
import { LaGlobeEuropeSolid  } from "oh-vue-icons/icons/la";
import { BiBalloon  } from "oh-vue-icons/icons/bi";
import enLocale from './i18n/en'

import LayoutBase from './layout/base.vue'
import BaseTitle from './components/base-title.vue'
import SubTitle from './components/sub-title.vue'
import Surface from './components/surface.vue'
import Badge from './components/badge.vue'
import CartoonList from './components/cartoon-list.vue'
import RankSummary from './components/rank-summary.vue'
import MenuList from './components/menu-list.vue'
import MenuItem from './components/menu-item.vue'

import IndexPage from './pages/index.vue'
import SettingsServiceIndexPage from './pages/settings/service/index.vue'

import 'normalize.css'
import './assets/index.scss'

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: enLocale
    }
})

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/', component: IndexPage, name: 'home' },
      { path: '/settings/service', component: SettingsServiceIndexPage, name: 'settings.service' },
    ],
})

const app = createApp({
    router,
    template: '<router-view />'
})

app.component("v-icon", OhVueIcon);
addIcons(
    MdKeyboardarrowleftRound,
    MdKeyboardarrowrightRound,
    MdScreenshotmonitor,
    SiObsstudio,
    SiDiscord,
    OiBlocked,
    LaGlobeEuropeSolid,
    BiBalloon, 
);

app.component('layout-base', LayoutBase)
app.component('base-title', BaseTitle)
app.component('sub-title', SubTitle)
app.component('surface', Surface)
app.component('badge', Badge)
app.component('cartoon-list', CartoonList)
app.component('rank-summary', RankSummary)
app.component('menu-list', MenuList)
app.component('menu-item', MenuItem)

app.use(i18n)
app.use(router)
app.mount('#app')
