// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueProgressiveImage from 'vue-progressive-image';
import App from '@/App';
import router from '@/router';
import storePlugin from '@/helpers/storePlugin';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VueProgressiveImage);
Vue.use(VueAxios, axios);
Vue.use(storePlugin);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {
    App,
  },
  created() {
    chrome.storage.sync.get('settings_global', (data) => {
      this.$store.commit('update', flow(
        groupBy('name'),
        map(values => [{}].concat(values).reduce((a, x) => Object.assign(a, x))),
      )([...this.$store.state.settings, ...((data || {}).settings_global || [])]).map(f => ({
        [f.name]: f.value,
      })).reduce((a, x) => Object.assign(a, x)));
    });
  },
});
Vue.filter('bytes', (nb) => {
  let bytes = nb;
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = -1;
  do {
    bytes /= thresh;
    i += 1;
  } while (Math.abs(bytes) >= thresh && i < units.length - 1);
  return `${bytes.toFixed(1)} ${units[i]}`;
});

Vue.filter('truncate', (string, nb) => {
  if (string.length < nb) {
    return string;
  }
  return `${string.substring(0, nb)}...`;
});

Vue.filter('filename', string => string.substring(string.lastIndexOf('/') + 1));
