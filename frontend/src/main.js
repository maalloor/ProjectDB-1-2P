import { createApp } from 'vue'
import datatable from 'datatables.net-bs4';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap";
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
