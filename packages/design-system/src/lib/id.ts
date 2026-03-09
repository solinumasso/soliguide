/**
 * Generate random id
 */
const generateId = (): string => {
  if (typeof crypto?.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(7);
};

export { generateId };
