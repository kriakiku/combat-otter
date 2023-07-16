import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'
import PrimeVue from 'primevue/config';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import UserButton from 'primevue/button';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdKeyboardarrowleftRound, MdKeyboardarrowrightRound, MdScreenshotmonitor  } from "oh-vue-icons/icons/md";
import { SiDiscord, SiObsstudio  } from "oh-vue-icons/icons/si";
import { OiBlocked  } from "oh-vue-icons/icons/oi";
import { LaGlobeEuropeSolid  } from "oh-vue-icons/icons/la";
import { BiBalloon } from "oh-vue-icons/icons/bi";
import { RiAlarmLine, RiZzzFill } from 'oh-vue-icons/icons/ri';
import enLocale from './i18n/en'
import uaLocale from './i18n/ua'
import ruLocale from './i18n/ru'
import ltLocale from './i18n/lt'

import LayoutBase from './layout/base.vue'
import LayoutService from './layout/service.vue'
import BaseTitle from './components/base-title.vue'
import SubTitle from './components/sub-title.vue'
import Surface from './components/surface.vue'
import Badge from './components/badge.vue'  
import CartoonList from './components/cartoon-list.vue'
import RankSummary from './components/rank-summary.vue'
import MenuList from './components/menu-list.vue'
import MenuItem from './components/menu-item.vue'
import SettingsLanguagePicker from './components/settings/language-picker.vue'
import ServiceIntervalPicker from './components/service/interval-picker.vue'

import IndexPage from './pages/index.vue'
import SettingsServiceIndexPage from './pages/settings/service/index.vue'
import SettingsServiceScreenshotPage from './pages/settings/service/screenshot.vue'

import "primevue/resources/themes/md-dark-deeppurple/theme.css";
import './assets/index.scss'

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
        en: enLocale,
        ua: uaLocale,
        ru: ruLocale,
        lt: ltLocale,
    }
})

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/', component: IndexPage, name: 'home' },
      { path: '/settings/service', component: SettingsServiceIndexPage, name: 'settings.service' },
      { path: '/settings/service/screenshot', component: SettingsServiceScreenshotPage, name: 'settings.service.screenshot'}
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
    RiAlarmLine,
    RiZzzFill,
);

/** Base components */
app.component('layout-base', LayoutBase)
app.component('layout-service', LayoutService)
app.component('base-title', BaseTitle)
app.component('sub-title', SubTitle)
app.component('surface', Surface)
app.component('badge', Badge)
app.component('cartoon-list', CartoonList)
app.component('rank-summary', RankSummary)
app.component('menu-list', MenuList)
app.component('menu-item', MenuItem)

/** Components with logic */
app.component('settings-language-picker', SettingsLanguagePicker)
app.component('service-interval-picker', ServiceIntervalPicker)

/** External components */
app.use(PrimeVue);
app.component('dropdown', Dropdown)
app.component('input-switch', InputSwitch)
app.component('user-button', UserButton)

app.use(i18n)
app.use(router)
app.mount('#app')
