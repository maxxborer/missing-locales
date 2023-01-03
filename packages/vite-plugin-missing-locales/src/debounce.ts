/**
 * Debounces a function by the specified delay.
 * @param fn - Function to debounce.
 * @param delay - Delay in milliseconds.
 * @returns Debounced function.
 */
const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(fn: F, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export default debounce;
