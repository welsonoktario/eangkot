const toSnake = (s: string) =>
  s.replace(/[A-Z]/g, ($1) => `_${$1.toLowerCase()}`);

export const keysToSnake = (o: any) => {
  if (o instanceof Object && !Array.isArray(o)) {
    const n = {};

    Object.keys(o).forEach((k) => {
      n[toSnake(k)] = keysToSnake(o[k]);
    });

    return n;
  } else if (o instanceof Object && Array.isArray(o)) {
    return o.map((i) => keysToSnake(i));
  }

  return o;
};
