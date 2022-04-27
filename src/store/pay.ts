import { Module } from 'vuex'
import { RootState } from '.'
import { PayTermPrice } from '../types/pay'

export interface PayModuleState {
  payTermPrice: PayTermPrice[]
}

export const payModule: Module<PayModuleState, RootState> = {
  namespaced: true,

  state: () => ({
    payTermPrice: [],
  }),

  mutations: {
    updateState(state: PayModuleState, payload: PayModuleState) {
      state['payTermPrice'] = payload['payTermPrice']
    },
  },
}
