import { Module } from '@/model/Module';

export enum HealthGroup {
  First,
  Second,
  Third
}

export const healthGroupName = (group: HealthGroup) => {
  switch (group) {
    case HealthGroup.First:
      return 'Основная';
    case HealthGroup.Second:
      return 'Подготовительная';
    case HealthGroup.Third:
      return 'Спец. группа';
  }
}

export class Student {
  public surname: string;
  public name: string;
  public middleName: string;

  public group: string;

  public healthGroup: HealthGroup;

  public modules: Module[] = [];

  public testMarks: Array<{ value: number | null }> = [];

  constructor(
    surname?: string,
    name?: string,
    middleName?: string,
    group?: string,
    healthGroup?: HealthGroup,
  ) {
    this.surname = surname || '';
    this.name = name || '';
    this.middleName = middleName || '';
    this.group = group || '';
    this.healthGroup = healthGroup || HealthGroup.First;
  }

  public get fullName(): string {
    return `${this.surname} ${this.name} ${this.middleName}`;
  }
}
