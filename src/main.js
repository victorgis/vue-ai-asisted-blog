// import './assets/main.css'

// src/main.js
import { createApp } from 'vue';
import App from './App.vue';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Create Vue application
const app = createApp(App);

// Mount the application to DOM
app.mount('#app');