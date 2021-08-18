// export function handleLSData<R extends object>(
//   action: 'set' | 'get',
//   field: string,
//   data?: object
// ): R | null {
//   if (action === 'set') {
//     localStorage[field] = JSON.stringify({ ...data, lastUpdate: Date.now() })
//     return null
//   }
//   if (action === 'get') {
//     return JSON.parse(localStorage[field])
//   }
//   return null
//   // throw new Error('LS handler receive wrong action')
// }

export const handleLSData = {
  get: function <R>(field: string): R {
    return JSON.parse(localStorage[field])
  },
  set: function (field: string, data: object) {
    localStorage[field] = JSON.stringify({ ...data, lastUpdate: Date.now() })
  },
}
// (
//   field: string,
//   data?: object
// ): R | null {
//   if (action === 'set') {
//     localStorage[field] = JSON.stringify({ ...data, lastUpdate: Date.now() })
//     return null
//   }
//   if (action === 'get') {
//     return JSON.parse(localStorage[field])
//   }
//   return null
// throw new Error('LS handler receive wrong action')
// }

export function debounce<argsT extends any[], R>(
  fn: (...args: argsT) => R,
  wait: number
) {
  let timeout: NodeJS.Timeout
  return (...args: argsT) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }
}

export function debounceP<argsT extends any[], R>(
  fn: (...args: argsT) => R,
  wait: number
) {
  let timeout: NodeJS.Timeout
  return (...args: argsT) => {
    clearTimeout(timeout)
    return new Promise(res => {
      timeout = setTimeout(() => res(fn(...args)), wait)
    })
  }
}

export const handleLSDataDebounce = debounce(handleLSData.set, 1000)
export const handleLSDataDebounceP = debounceP(handleLSData.set, 1000)

// const objectsIsNotEqual = (obj1: object, obj2: object) => {
//   let keys = Object.keys(obj1)
//   return keys.some(
//     key => JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])
//   )
// }
