export const setItem = (key: string, item: any) => {
  const tmp = JSON.stringify(item);
  return localStorage.setItem(key, tmp);
};

export const getItemArray = (key: string): Array<any> => {
  const str = localStorage.getItem(key);
  if (str) {
    return JSON.parse(str);
  } else return [];
};

export const getItem = (key: string): string | null => {
  return localStorage.getItem(key);
};
