import * as assert from 'power-assert'
import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { getter, mutation, action, state } from '../src/index'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(Vuex)

describe('State', () => {
  it('returns mapped state', () => {
    const store = new Store({
      state: {
        value: 123
      }
    })

    const mapper = state('value')
    const value = mapper(store)
    assert(value() === 123)
  })

  it('returns namespaced state', () => {
    const store = new Store({
      modules: {
        foo: {
          namespaced: true,
          state: {
            message: 'Hello'
          }
        }
      }
    })

    const mapper = state('foo', 'message')
    const message = mapper(store)
    assert(message() === 'Hello')
  })

  it('receives mapper function', () => {
    const store = new Store({
      state: {
        value: 123
      },

      getters: {
        plus10: state => state.value + 10
      }
    })

    const mapper = state((state, getters) => {
      return state.value + getters.plus10
    })
    const value = mapper(store)
    assert(value() === 256)
  })

  it('receives mapper function with namespace', () => {
    const store = new Store({
      modules: {
        test: {
          namespaced: true,

          state: {
            value: 123
          },

          getters: {
            plus10: state => state.value + 10
          }
        }
      }
    })

    const mapper = state('test', (state, getters) => {
      return state.value + getters.plus10
    })
    const value = mapper(store)
    assert(value() === 256)
  })
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

  it('receives mapper function', () => {
    const store = new Store({
      state: {
        value: 1
      },

      mutations: {
        increment(state, payload) {
          state.value += payload
        }
      }
    })

    const incrementMapper = mutation((commit, payload: number) => {
      commit('increment', payload * 10)
      return 'test'
    })
    const increment = incrementMapper(store)
    assert(increment(2) === 'test')
    assert(store.state.value === 21)
  })

  it('receives mapper function with namespace', () => {
    const store = new Store<any>({
      modules: {
        foo: {
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

    const updateMapper = mutation('foo', (commit, payload: string) => {
      commit('update', payload + ' from mapper')
      return payload
    })
    const update = updateMapper(store)

    assert(update('Bar') === 'Bar')
    assert(store.state.foo.message === 'Bar from mapper')
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

  it('receives mapper function', () => {
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

    const mapper = action((dispatch, payload: number) => {
      dispatch('doubleIncrement', payload * 2)
      return payload
    })
    const increment = mapper(store)
    assert(increment(10) === 10)
    assert(store.state.value === 163)
  })

  it('receives mapper function with namespace', () => {
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

    const mapper = action('test', (dispatch, payload: string) => {
      dispatch('doubleAssign', payload + payload)
      return payload
    })
    const doubleAssign = mapper(store)

    assert(doubleAssign('Bar') === 'Bar')
    assert(store.state.test.message === 'BarBarBarBar')
  })
})
