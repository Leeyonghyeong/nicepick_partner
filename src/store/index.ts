import { createStore, createLogger } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { AuthModuleState, authModule as auth } from './auth'
import { PayModuleState, payModule as pay } from './pay'

export interface RootState {
  auth: AuthModuleState
  pay: PayModuleState
}

export default createStore({
  modules: {
    auth,
    pay,
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
