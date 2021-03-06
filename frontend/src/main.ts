import { createApp } from 'vue'
import App from './App.vue';
import store from './store';
import './index.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTimes);
const app = createApp(App).use(store);
app.component('fa-icon', FontAwesomeIcon);
app.mount('#app');
