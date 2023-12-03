/**
 * Gets the first entry of an array, or undefined
 */
export const head = <T>(arr: ArrayLike<T>): T | undefined => (arr ?? [])[0];

/**
 * Gets the last entry of an array, or undefined
 */
export const tail = <T>(arr: ArrayLike<T>): T | undefined => (arr ?? [])[(arr ?? []).length - 1];
