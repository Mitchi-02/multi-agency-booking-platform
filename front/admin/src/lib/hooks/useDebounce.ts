const useDebounce = <T extends any[]>(func: (...params: T) => any, wait?: number) => {
  let timerId: NodeJS.Timeout
  return (wait2?: number, ...args: T) => {
    if (timerId) clearTimeout(timerId)
    timerId = setTimeout(
      () => {
        func(...args)
      },
      wait2 ?? wait ?? 1000
    )
  }
}

export default useDebounce
