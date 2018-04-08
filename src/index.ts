import {
  Store,
  Commit,
  Dispatch,
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'

export type Getter<R> = () => R
export type Action<P, R> = P extends undefined
  ? (payload?: P) => R
  : (payload: P) => R

export type HasKey<K extends string> = { [_ in K]: any }

export type Mapper<T> = (store: Store<any>) => T

export type StateMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Getter<T[K]>

export type GetterMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Getter<T[K]>

export type MutationMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Action<T[K], void>

export type ActionMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Action<T[K], Promise<any>>

function createMapper(
  vuexMapper: Function,
  namespace: string | undefined,
  map: string | Function
): (store: Store<any>) => Function {
  const mapConfig = { _: map as any }
  const mapper =
    namespace !== undefined
      ? vuexMapper(namespace, mapConfig)._
      : vuexMapper(mapConfig)._
  return store => mapper.bind({ $store: store })
}

export function state<K extends string>(key: K): StateMapper<K>
export function state<R>(map: (state: any, getters: any) => R): Mapper<() => R>
export function state<K extends string>(
  namespace: string,
  key: K
): StateMapper<K>
export function state<R>(
  namespace: string,
  map: (state: any, getters: any) => R
): Mapper<() => R>
export function state(_namespace: string | Function, _map?: string | Function) {
  const { namespace, map } = normalizeNamespace(_namespace, _map)
  return createMapper(mapState, namespace, map)
}

export function getter<K extends string>(key: K): GetterMapper<K>
export function getter<K extends string>(
  namespace: string,
  key: K
): GetterMapper<K>
export function getter(_namespace: string, _map?: string) {
  const { namespace, map } = normalizeNamespace(_namespace, _map)
  return createMapper(mapGetters, namespace, map)
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
  return createMapper(mapMutations, namespace, map)
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
  return createMapper(mapActions, namespace, map)
}

function normalizeNamespace<F extends Function>(
  namespace: string | F,
  map: string | F | undefined
): { namespace?: string; map: string | F } {
  if (map == null) {
    return {
      map: namespace
    }
  }

  return {
    namespace: namespace as string,
    map
  }
}
