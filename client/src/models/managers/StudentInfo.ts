import axios from 'axios';
import moment from 'moment-timezone';

import bus from '@/models/Bus';
import { Omit } from '../Stuff';

export type HealthGroup = 1 | 2 | 3;

export interface IStudentInfoData {
  id: number;
  student: number;
  semester: number;
  healthGroup: HealthGroup;
  receiptDate: Date | null;
  diary: number;
  competitions: number;
  personalQualities: number;
  examDate: Date | null;
}

export class StudentInfo implements IStudentInfoData {
  public id: number;
  public student: number;
  public semester: number;
  public healthGroup: HealthGroup;
  public receiptDate: Date | null;
  public diary: number;
  public competitions: number;
  public personalQualities: number;
  public examDate: Date | null;

  constructor(data?: Partial<IStudentInfoData>) {
    this.id = (data && data.id) || -1;
    this.student = (data && data.student) || -1;
    this.semester = (data && data.semester) || -1;
    this.healthGroup = (data && data.healthGroup) || 1;
    this.receiptDate =
      (data && data.receiptDate && moment(data.receiptDate).toDate()) || null;
    this.diary = (data && data.diary) || 0;
    this.competitions = (data && data.competitions) || 0;
    this.personalQualities = (data && data.personalQualities) || 0;
    this.examDate =
      (data && data.examDate && moment(data.examDate).toDate()) || null;
  }

  public get summ() {
    return this.diary + this.competitions + this.personalQualities;
  }
}

export type StudentInfoEvent =
  | 'student_info_created'
  | 'student_info_updated'
  | 'student_info_removed';

export class StudentInfoManager {
  public async fetchStudentInfo(studentId: number, semesterId: number) {
    const res = await axios.get<IStudentInfoData>(
      `student/${studentId}/info/semester/${semesterId}`
    );
    return new StudentInfo(res.data);
  }

  public async create(data: Omit<IStudentInfoData, 'id'>) {
    const res = await axios.post<number>('student_info', data);

    const studentInfo = new StudentInfo({
      ...data,
      id: res.data
    });
    bus.fire('student_info_created', studentInfo);
    return studentInfo;
  }

  public async update(
    data: IStudentInfoData,
    property?: keyof Pick<
      StudentInfo,
      Exclude<keyof StudentInfo, 'id' | 'summ'>
    >
  ) {
    await axios.put(
      'student_info',
      property == null
        ? data
        : {
            id: data.id,
            [property]: data[property]
          }
    );
    const studentInfo = new StudentInfo(data);

    bus.fire('student_info_updated', studentInfo);
    return studentInfo;
  }

  public async remove(id: number) {
    await axios.delete(`student_info/${id}`);
    bus.fire('student_info_removed', id);
  }
}
