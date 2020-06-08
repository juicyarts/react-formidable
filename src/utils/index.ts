export const isFunction = (input: unknown): input is () => void => typeof input === 'function';
