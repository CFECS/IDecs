import Vue from 'vue';
import Vuex, { Store } from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store<any>({});

const createStore = (): Store<any> => {
  return store;
};

export default createStore;
