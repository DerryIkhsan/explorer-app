//import createApp from Vue
import { createApp } from 'vue';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far)
dom.watch();

//import component App
import App from './App.vue';

//import config router
import router from './router'

//create App Vue
const app = createApp(App);

//gunakan "router" di Vue dengan plugin "use"
app.use(router);

app
.component("font-awesome-icon", FontAwesomeIcon)
.mount('#app');