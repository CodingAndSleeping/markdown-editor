import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { MdEditor,MdCatalog, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';


import 'virtual:svg-icons-register'
const app = createApp(App)

app.component('md-editor', MdEditor)
app.component('md-catalog', MdCatalog)
app.component('md-preview', MdPreview)

app.mount('#app')
