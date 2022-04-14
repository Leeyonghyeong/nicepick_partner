import { createStore, createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { AuthModuleState, authModule as auth } from './auth'

export interface RootState {
  auth: AuthModuleState
}

export default createStore({
  modules: {
    auth,
  },
  plugins:
    process.env.NODE_ENV !== 'production'
      ? [
          createLogger(),
          createPersistedState({
            paths: ['auth'],
          }),
        ]
      : [
          createPersistedState({
            paths: ['auth'],
          }),
        ],
})
