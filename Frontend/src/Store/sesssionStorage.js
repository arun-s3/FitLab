import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

const createSessionStorage = ()=> {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {}
    }
  }
  return createWebStorage('session')
}

export default createSessionStorage()
