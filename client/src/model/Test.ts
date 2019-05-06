export class Test {
  public name: string;
  public grades: number[] = [];
  public direction: 'min' | 'max' = 'max';

  constructor(name: string) {
    this.name = name;
  }

  public convert(value: number): number {
    if (this.grades.length !== 5) {
      throw Error('Each test must contain 5 grades!');
    }

    if (this.direction === 'max') {
      if (value < this.grades[0]) {
        return 0;
      }
      for (let i = 0; i < 4; ++i) {
        if (value >= this.grades[i] && value < this.grades[i + 1]) {
          return i + 1;
        }
      }
      return 5;
    } else {
      if (value > this.grades[0]) {
        return 0;
      }
      for (let i = 0; i < 4; ++i) {
        if (value <= this.grades[i] && value > this.grades[i + 1]) {
          return i + 1;
        }
      }
      return 5;
    }
  }
}
