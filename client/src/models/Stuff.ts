import Vue from 'vue';

export const updateIfExists = (
  array: Array<{ id: number }>,
  value: { id: number }
) => {
  const index = array.findIndex((v) => v.id === value.id);

  if (index < 0) {
    return;
  }

  Vue.set(array, index, value);
};

export const insertOrUpdate = (
  array: Array<{ id: number }>,
  value: { id: number }
) => {
  const index = array.findIndex((v) => v.id === value.id);

  if (index < 0) {
    array.push(value);
  } else {
    Vue.set(array, index, value);
  }
};

export const deleteByIndex = (array: Array<{ id: number }>, id: number) => {
  const index = array.findIndex((v) => v.id === id);

  if (index >= 0) {
    Vue.delete(array, index);
  }
};

export const sync = (
  dest: Array<{ id: number }>,
  source: Array<{ id: number }>
) => {
  for (let i = 0; i < dest.length; ++i) {
    const sourceIndex = source.findIndex((v) => v.id === dest[i].id);
    if (sourceIndex < 0) {
      Vue.delete(dest, i);
    } else {
      Vue.set(dest, i, source[sourceIndex]);
    }
  }
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
