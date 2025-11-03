import { createApp } from 'vue'
import VxeUIBase from 'vxe-pc-ui'
import VxeUITable from 'vxe-table'
import App from './App.vue'
import 'element-plus/dist/index.css'
import 'vxe-pc-ui/es/style.css'
import 'vxe-table/es/style.css'
import './style.css'

createApp(App).use(VxeUIBase).use(VxeUITable).mount('#app')
