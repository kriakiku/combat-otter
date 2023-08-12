import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import timeago from 'vue-timeago3'
import PrimeVue from 'primevue/config';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import UserButton from 'primevue/button';
import Dialog from 'primevue/dialog';
import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdKeyboardarrowleftRound, MdKeyboardarrowrightRound, MdScreenshotmonitor, MdFibermanualrecordSharp, MdImagenotsupportedSharp, MdCloseRound } from "oh-vue-icons/icons/md";
import { SiDiscord, SiObsstudio  } from "oh-vue-icons/icons/si";
import { OiBlocked  } from "oh-vue-icons/icons/oi";
import { LaGlobeEuropeSolid  } from "oh-vue-icons/icons/la";
import { BiBalloon, BiSignpostFill, BiWindowDesktop, BiCheckLg } from "oh-vue-icons/icons/bi";
import { RiAlarmLine, RiZzzFill, RiWindowLine } from 'oh-vue-icons/icons/ri';
import enLocale from './i18n/en'
import uaLocale from './i18n/ua'
import ruLocale from './i18n/ru'
import ltLocale from './i18n/lt'

import App from './app.vue'
import LayoutBase from './layout/base.vue'
import BaseTitle from './components/base-title.vue'
import SubTitle from './components/sub-title.vue'
import Surface from './components/surface.vue'
import Badge from './components/badge.vue'  
import CartoonList from './components/cartoon-list.vue'
import RankSummary from './components/rank-summary.vue'
import MenuList from './components/menu-list.vue'
import MenuItem from './components/menu-item.vue'
import TimeAgo from './components/time-ago.vue'
import SettingsLanguagePicker from './components/settings/language-picker.vue'
import ServiceFrequencyPicker from './components/service/frequency/picker.vue'
import ServiceAreaSelector from './components/service/area-selector/area-selector.vue'
import ServiceInputSourcePicker from './components/service/input-source/picker.vue'

import IndexPage from './pages/index.vue'
import SettingsServicePage from './pages/settings/service.vue'

import "primevue/resources/themes/md-dark-deeppurple/theme.css";
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
import './assets/index.scss';

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
      { path: '/settings/service', component: SettingsServicePage, name: 'settings.service' },
    ],
})

const app = createApp({
    router,
    template: '<app />',
})

app.component("v-icon", OhVueIcon);
addIcons(
    MdKeyboardarrowleftRound,
    MdKeyboardarrowrightRound,
    MdScreenshotmonitor,
    MdFibermanualrecordSharp,
    MdImagenotsupportedSharp,
    MdCloseRound,
    SiObsstudio,
    SiDiscord,
    OiBlocked,
    LaGlobeEuropeSolid,
    BiBalloon,
    BiSignpostFill,
    BiWindowDesktop,
    RiAlarmLine,
    RiWindowLine,
    BiCheckLg,
    RiZzzFill,
);

/** Base components */
app.component('app', App)
app.component('layout-base', LayoutBase)
app.component('base-title', BaseTitle)
app.component('sub-title', SubTitle)
app.component('surface', Surface)
app.component('badge', Badge)
app.component('cartoon-list', CartoonList)
app.component('rank-summary', RankSummary)
app.component('menu-list', MenuList)
app.component('menu-item', MenuItem)
app.component('time-ago', TimeAgo)

/** Components with logic */
app.component('settings-language-picker', SettingsLanguagePicker)
app.component('service-frequency-picker', ServiceFrequencyPicker)
app.component('service-input-source-picker', ServiceInputSourcePicker)
app.component('service-area-selector', ServiceAreaSelector)

/** External components */
app.use(createPinia());
app.use(PrimeVue);
app.component('dropdown', Dropdown)
app.component('input-switch', InputSwitch)
app.component('user-button', UserButton)
app.component('dialog-window', Dialog)

app.use(i18n)
app.use(router)
app.use(timeago, {
    locale: 'en',
    locales: {
        en: require('date-fns/locale/en-GB'),
        lt: require('date-fns/locale/lt'),
        ru: require('date-fns/locale/ru'),
        ua: require('date-fns/locale/uk'),
    }
})
app.mount('#app')
