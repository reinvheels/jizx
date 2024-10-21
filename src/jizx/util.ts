export const arr = <T, O>(arg: T[] | O): T[] | undefined => (Array.isArray(arg) ? arg : undefined);
export const str = <O>(arg: string | O): string | undefined => (typeof arg === 'string' ? arg : undefined);
