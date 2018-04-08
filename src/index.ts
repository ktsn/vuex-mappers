import { Store } from 'vuex'

export type Getter<R> = () => R
export type Mutation<P> = P extends undefined
  ? (payload?: P) => void
  : (payload: P) => void
export type Action<P> = P extends undefined
  ? (payload?: P) => Promise<any>
  : (payload: P) => Promise<any>

export type HasKey<K extends string> = { [_ in K]: any }

export type GetterMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Getter<T[K]>

export type MutationMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Mutation<T[K]>

export type ActionMapper<K extends string> = <T extends HasKey<K>>(
  store: Store<any>
) => Action<T[K]>

export function getter<K extends string>(key: K): GetterMapper<K>
export function getter<K extends string>(
  namespace: string,
  key: K
): GetterMapper<K>
export function getter(_namespace: string, _key?: string) {
  const key = normalizeKey(_namespace, _key)
  return (store: Store<any>) => () => store.getters[key]
}

export function mutation<K extends string>(key: K): MutationMapper<K>
export function mutation<K extends string>(
  namespace: string,
  key: K
): MutationMapper<K>
export function mutation(_namespace: string, _key?: string) {
  const key = normalizeKey(_namespace, _key)
  return (store: Store<any>) => (payload: any) => store.commit(key, payload)
}

export function action<K extends string>(key: K): ActionMapper<K>
export function action<K extends string>(
  namespace: string,
  key: K
): ActionMapper<K>
export function action(_namespace: string, _key?: string) {
  const key = normalizeKey(_namespace, _key)
  return (store: Store<any>) => (payload: any) => store.dispatch(key, payload)
}

function normalizeKey(namespace: string, key: string | undefined): string {
  if (key == null) {
    return namespace
  }

  if (namespace[namespace.length - 1] !== '/') {
    namespace = namespace + '/'
  }

  return namespace + key
}
