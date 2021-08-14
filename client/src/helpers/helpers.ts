export function handleLSData(
  action: 'set' | 'get',
  field: string,
  data?: Object
): void | Object {
  if (action === 'set') {
    localStorage[field] = JSON.stringify({ ...data, lastUpdate: Date.now() })
  }
  if (action === 'get') {
    return JSON.parse(localStorage[field])
  }
}

export function debounce<argsT extends any[], returnT>(
  fn: (...args: argsT) => returnT,
  wait: number
) {
  let timeout: NodeJS.Timeout
  return (...args: argsT) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), wait)
  }
}

export function debounceP<argsT extends any[], returnT>(
  fn: (...args: argsT) => returnT,
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

export const handleLSDataDebounce = debounce<
  ['set' | 'get', string, Object],
  void | Object
>(handleLSData, 1000)

// должен вернуть промис??
export const handleLSDataDebounceP = debounceP<
  ['set' | 'get', string, Object],
  void | Object
>(handleLSData, 1000)

// const objectsIsNotEqual = (obj1: any, obj2: any) => {
//   let keys = Object.keys(obj1)
//   return keys.some(
//     key => JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])
//   )
// }
