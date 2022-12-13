export const min = (a, b) => {
  return a < b ? a : b;
}

export const max = (a, b) => {
  return a < b ? b : a;
}

export const cssVar = (name) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

// export {min, max}
