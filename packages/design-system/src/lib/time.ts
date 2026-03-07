const DEFAULT_DEBOUNCE_DELAY = 300 as const;

/**
 * A simple debounce function
 */
const debounce = <A = unknown, R = void>(
  fn: (args: A) => R,
  delay: number = DEFAULT_DEBOUNCE_DELAY
): ((args: A) => void) => {
  // eslint-disable-next-line fp/no-let
  let timer: ReturnType<typeof setTimeout>;

  return (args: A): void => {
    if (timer) {
      clearTimeout(timer);
    }
    // eslint-disable-next-line fp/no-mutation
    timer = setTimeout(() => fn(args), delay);
  };
};

export { debounce, DEFAULT_DEBOUNCE_DELAY };
