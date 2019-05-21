import Vue from 'vue';

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

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
