import { Module } from 'vuex'
import { RootState } from '.'
import { PayTermPrice } from '../types/pay'

export interface PayModuleState {
  payTermPrice: PayTermPrice[]
  serviceType: string
}

export const payModule: Module<PayModuleState, RootState> = {
  namespaced: true,

  state: () => ({
    payTermPrice: [],
    serviceType: 'premium',
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
