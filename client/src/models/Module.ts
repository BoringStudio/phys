export enum MarkType {
  Schedule,
  OutOfSchedule,
  Skip,
  TrustedSkip,
  Ill,
  Retrieval
}

export class Module {
  public static markWeight(mark: MarkType) {
    switch (mark) {
      case MarkType.Schedule:
        return 2.5;
      case MarkType.OutOfSchedule:
        return 2;
      case MarkType.Skip:
        return 0;
      case MarkType.TrustedSkip:
        return 2.5;
      case MarkType.Ill:
        return 2;
      case MarkType.Retrieval:
        return 2;
    }
  }

  public position: number;
  public marks: Array<{ value: MarkType | null }> = [];

  constructor(position: number) {
    this.position = position;
  }

  public get summ() {
    return this.marks.reduce(
      (sum, mark) =>
        sum + (mark.value == null ? 0 : Module.markWeight(mark.value)),
      0
    );
  }
}
