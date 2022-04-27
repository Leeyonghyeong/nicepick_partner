import { Module } from 'vuex'
import { RootState } from '.'
import { User } from '../types/auth'

export interface AuthModuleState {
  user: User
  isLogin: boolean
  brandId: string
}

export const authModule: Module<AuthModuleState, RootState> = {
  namespaced: true,

  state: () => ({
    user: {} as User,
    isLogin: false,
    brandId: '',
  }),

  mutations: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateState(state: any, payload: any) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key]
      })
    },
  },
}
