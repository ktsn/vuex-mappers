import { Store, Commit, Dispatch } from 'vuex'

export type Getter<R> = () => R
export type Action<P, R> = P extends undefined
  ? (payload?: P) => R
  : (payload: P) => R

export type HasKey<K extends string> = { [_ in K]: any }

export type Mapper<T> = (store: Store<any>) => T

export type GetterMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Getter<T[K]>

export type MutationMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Action<T[K], void>

export type ActionMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Action<T[K], Promise<any>>

export function getter<K extends string>(key: K): GetterMapper<K>
export function getter<K extends string>(
  namespace: string,
  key: K
): GetterMapper<K>
export function getter(_namespace: string, _map?: string) {
  const { namespace, map } = normalizeNamespace(_namespace, _map)
  return (store: Store<any>) => () => store.getters[namespace + map]
}

export function mutation<K extends string>(key: K): MutationMapper<K>
export function mutation<P, R>(
  map: (commit: Commit, payload: P) => R
): Mapper<(payload: P) => R>
export function mutation<K extends string>(
  namespace: string,
  key: K
): MutationMapper<K>
export function mutation<P, R>(
  namespace: string,
  map: (commit: Commit, payload: P) => R
): Mapper<(payload: P) => R>
export function mutation(
  _namespace: string | Function,
  _map?: string | Function
) {
  const { namespace, map } = normalizeNamespace(_namespace, _map)
  if (typeof map === 'function') {
    return (store: Store<any>) => {
      const commit = namespacedFunction(store.commit, namespace)
      return (payload: any) => map(commit, payload)
    }
  } else {
    return (store: Store<any>) => (payload: any) => {
      return store.commit(namespace + map, payload)
    }
  }
}

export function action<K extends string>(key: K): ActionMapper<K>
export function action<P, R>(
  map: (commit: Dispatch, payload: P) => R
): Mapper<(payload: P) => R>
export function action<K extends string>(
  namespace: string,
  key: K
): ActionMapper<K>
export function action<P, R>(
  namespace: string,
  map: (commit: Dispatch, payload: P) => R
): Mapper<(payload: P) => R>
export function action(
  _namespace: string | Function,
  _map?: string | Function
) {
  const { namespace, map } = normalizeNamespace(_namespace, _map)
  if (typeof map === 'function') {
    return (store: Store<any>) => {
      const dispatch = namespacedFunction(store.dispatch, namespace)
      return (payload: any) => map(dispatch, payload)
    }
  } else {
    return (store: Store<any>) => (payload: any) => {
      return store.dispatch(namespace + map, payload)
    }
  }
}

function namespacedFunction<F extends (key: string, payload: any) => any>(
  dispatcher: F,
  namespace: string
): F {
  return ((key: string, payload: any) => {
    dispatcher(namespace + key, payload)
  }) as F
}

function normalizeNamespace<F extends Function>(
  namespace: string | F,
  map: string | F | undefined
): { namespace: string; map: string | F } {
  if (map == null) {
    return {
      namespace: '',
      map: namespace
    }
  }

  let n = namespace as string
  if (n[n.length - 1] !== '/') {
    n = n + '/'
  }

  return {
    namespace: n,
    map
  }
}
