import * as assert from 'power-assert'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { getter, mutation, action } from '../src/index'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(Vuex)

describe('State', () => {
  it('returns mapped state', () => {})
})

describe('Getter', () => {
  it('returns mapped getter function', () => {
    const store = new Store({
      state: {
        value: 123
      },

      getters: {
        double: state => state.value * 2
      }
    })

    const doubleMapper = getter('double')
    const double = doubleMapper(store)
    assert(double() === 246)
  })

  it('returns namespaced getter function', () => {
    const store = new Store({
      modules: {
        test: {
          namespaced: true,

          state: {
            message: 'World'
          },

          getters: {
            greet: state => 'Hello, ' + state.message
          }
        }
      }
    })

    const greetMapper = getter('test', 'greet')
    const greet = greetMapper(store)
    assert(greet() === 'Hello, World')
  })
})

describe('Mutation', () => {
  it('returns mapped mutation function', () => {
    const store = new Store({
      state: {
        value: 123
      },

      mutations: {
        increment(state, payload) {
          state.value += payload
        }
      }
    })

    const incrementMapper = mutation('increment')
    const increment = incrementMapper(store)
    increment(10)
    assert(store.state.value === 133)
  })

  it('returns namespaced mutation function', () => {
    const store = new Store<any>({
      modules: {
        test: {
          namespaced: true,

          state: {
            message: 'Foo'
          },

          mutations: {
            update(state, payload) {
              state.message = payload
            }
          }
        }
      }
    })

    const updateMapper = mutation('test', 'update')
    const update = updateMapper(store)
    update('Bar')
    assert(store.state.test.message === 'Bar')
  })
})

describe('Action', () => {
  it('returns mapped action function', () => {
    const store = new Store({
      state: {
        value: 123
      },

      mutations: {
        increment(state, payload) {
          state.value += payload
        }
      },

      actions: {
        doubleIncrement({ commit }, payload) {
          commit('increment', payload * 2)
        }
      }
    })

    const mapper = action('doubleIncrement')
    const doubleIncrement = mapper(store)
    doubleIncrement(10)
    assert(store.state.value === 143)
  })

  it('returns namespaced action function', () => {
    const store = new Store<any>({
      modules: {
        test: {
          namespaced: true,

          state: {
            message: 'Foo'
          },

          mutations: {
            update(state, payload) {
              state.message = payload
            }
          },

          actions: {
            doubleAssign({ commit }, payload) {
              commit('update', payload + payload)
            }
          }
        }
      }
    })

    const mapper = action('test', 'doubleAssign')
    const doubleAssign = mapper(store)
    doubleAssign('Bar')
    assert(store.state.test.message === 'BarBar')
  })
})
