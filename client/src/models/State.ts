import axios from 'axios';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

import moment from 'moment-timezone';
moment.tz.setDefault('Europe/Moscow');

import { UserManager } from './managers/User';
import { ClassroomManager } from './managers/Classroom';
import { TestManager } from './managers/Test';
import { StudentManager } from './managers/Student';
import { GroupManager } from './managers/Group';
import { DisciplineManager } from './managers/Discipline';
import { MarkManager } from './managers/Mark';
import { ModuleManager } from './managers/Module';
import { SemesterManager } from './managers/Semester';
import { LessonManager } from './managers/Lesson';
import { ParameterManager } from './managers/Parameters';
import { StudentVisitManager } from './managers/StudentVisit';
import { StudentInfoManager } from './managers/StudentInfo';

export class State {
  public userManager: UserManager = new UserManager();
  public classroomManager: ClassroomManager = new ClassroomManager();
  public testManager: TestManager = new TestManager();
  public groupManager: GroupManager = new GroupManager();
  public studentManager: StudentManager = new StudentManager();
  public disciplineManager: DisciplineManager = new DisciplineManager();
  public markManager: MarkManager = new MarkManager();
  public moduleManager: ModuleManager = new ModuleManager();
  public semesterManager: SemesterManager = new SemesterManager();
  public lessonManager: LessonManager = new LessonManager();
  public parameterManager: ParameterManager = new ParameterManager();
  public studentVisitManager: StudentVisitManager = new StudentVisitManager();
  public studentInfoManager: StudentInfoManager = new StudentInfoManager();
}

const state = new State();
export default state;
