# vuex-mappers

Component agnostic Vuex mappers.

## Usage

Install it via npm:

```sh
$ npm install vuex-mappers
```

There are four mappers in vuex-mappers: `state`, `getter`, `mutation` and `action`. They have similar API with [Vuex's `mapXXX` helpers](https://vuex.vuejs.org/en/api.html#component-binding-helpers) but are Vue component agnostic and return only one bound function.

For example, imagine following store:

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    count: 0
  },

  getters: {
    double: state => state.count * 2
  },

  mutations: {
    inc(state, amount) {
      state.count += amount
    }
  },

  actions: {
    incAsync({ commit }, amount) {
      setTimeout(() => {
        commit('inc', amount)
      }, 1000)
    }
  }
})
```

Then you declare store mappers:

```js
import { state, getters, mutations, actions } from 'vuex-mappers'
import { store } from './store'

const count = state('count')(store)
const double = getter('double')(store)
const inc = mutation('inc')(store)
const incAsync = action('incAsync')(store)

console.log(count()) // store.state.count
console.log(double()) // store.getters.double
inc(123) // store.commit('inc', 123)
incAsync(123) // store.dispatch('incAsync', 123)
```

You may want to pass namespace for the mapper:

```js
import Vuex from 'vuex'
import { state } from 'vuex-mappers'

const store = new Vuex.Store({
  modules: {
    foo: {
      namespaced: true,

      state: {
        message: 'Hello'
      }
    }
  }
})

// You can specify namespace value to 1st argument
const message = state('foo/', 'message')(store)
console.log(message()) // -> Hello
```

`state` mapper also receive a function which receives store state and getters:

```js
import Vuex from 'vuex'
import { state } from 'vuex-mappers'

const store = new Vuex.Store({
  state: {
    count: 1
  },

  getters: {
    double: state => state.count * 2
  }
})

const value = state((state, getters) => {
  return state.count + getters.double
})(store)

console.log(value()) // -> 3
```

`mutation` and `action` mapper can receive a function for more flexible mapping:

```js
import Vuex from 'vuex'
import { mutation, action } from 'vuex-mappers'

const store = new Vuex.Store({
  state: {
    count: 0
  },

  mutations: {
    inc(state, amount) {
      state.count += amount
    }
  },

  actions: {
    incAsync({ commit }, amount) {
      setTimeout(() => {
        commit('inc', amount)
      }, 1000)
    }
  }
})

const incDouble = mutation((commit, amount) => {
  commit('inc', amount * 2)
})(store)

const incDoubleAsync = action((dispatch, amount) => {
  dispatch('incAsync', amount * 2)
})(store)

incDouble(123)
incDoubleAsync(123)
```

## License

MIT
