import { createStore, createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

// export interface RootState {}

export default createStore({
  modules: {},
  plugins:
    process.env.NODE_ENV !== 'production'
      ? [
          createLogger(),
          createPersistedState({
            paths: [],
          }),
        ]
      : [
          createPersistedState({
            paths: [],
          }),
        ],
})
