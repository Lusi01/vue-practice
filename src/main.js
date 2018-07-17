import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import BuyModalComponent from '@/components/Shared/BuyModal'
import * as fb from 'firebase'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
    theme: {
       // primary: colors.red.darken1, // #E53935
      //  secondary: colors.red.lighten4, // #FFCDD2
      //  accent: colors.indigo.base // #3F51B5
    }
})
Vue.component('app-buy-modal', BuyModalComponent)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store: store,
    components: {App},
    template: '<App/>',
    created () {
        var config = {
            apiKey: 'AIzaSyDgi5j7HIEah0ymDhrqPEir0QUiQFVnxcw',
            authDomain: 'itc-ads1.firebaseapp.com',
            databaseURL: '"https://itc-ads1.firebaseio.com',
            projectId: 'itc-ads1',
            storageBucket: 'itc-ads1.appspot.com',//itc-ads1.appspot.com
            messagingSenderId: '705064659785'
        }

        fb.initializeApp(config);

        fb.auth().onAuthStateChanged(user => {
            if (user) {
                this.$store.dispatch('autoLoginUser', user)
            }
        })

        this.$store.dispatch('fetchAds')
    }

})

