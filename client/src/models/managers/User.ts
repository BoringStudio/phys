import axios from 'axios';
import jwt from 'jsonwebtoken';

import bus from '@/models/Bus';
import { Omit } from '../Stuff';

const LOCAL_STORAGE_ACCESS_TOKEN = 'access-token';

export class AuthData {
  public login: string = '';
  public password: string = '';
}

export interface IUserData {
  id: number;
  login: string;
  surname: string;
  name: string;
  middlename: string;
  fullAccess: boolean;
}

interface IPayload extends IUserData {
  iat: number;
  exp: number;
}

export class User implements IUserData {
  public id: number = -1;
  public login: string = '';
  public surname: string = '';
  public name: string = '';
  public middlename: string = '';
  public fullAccess: boolean = false;

  constructor(data?: IUserData) {
    if (data == null) {
      return;
    }

    this.id = data.id;
    this.login = data.login;
    this.surname = data.surname;
    this.name = data.name;
    this.middlename = data.middlename;
    this.fullAccess = data.fullAccess;
  }

  public get fullName() {
    return (
      `${this.surname} ${this.name}` +
      (this.middlename.length > 0 ? ` ${this.middlename}` : '')
    );
  }
}

export class FullUserInfo extends User {
  public password: string | null = null;
}

export type UserEvent =
  | 'user_authorized'
  | 'user_created'
  | 'user_updated'
  | 'user_removed';

export class UserManager {
  public currentUser: User | null = null;

  private accountExpiration: number = 0;

  constructor() {
    this.restoreData();
  }

  public async auth(data: AuthData) {
    const res = await axios.post<{
      token: string;
    }>('auth', data);

    this.storeData(res.data.token);
  }

  public unauth() {
    this.storeData(null);
  }

  public get authorized() {
    return this.currentUser != null && Date.now() < this.accountExpiration;
  }

  public async fetchAll() {
    const res = await axios.get<IUserData[]>('users');
    return res.data.map((data) => new User(data));
  }

  public async fetchOne(id: number) {
    const res = await axios.get<IUserData>(`user/${id}`);
    return new User(res.data);
  }

  public async search(value: string, limit: number = 10) {
    const res = await axios.get<IUserData[]>(
      `users/search?match=${encodeURIComponent(value)}&limit=${limit}`
    );
    return res.data.map((data) => new User(data));
  }

  public async create(data: Omit<IUserData, 'id'>) {
    const res = await axios.post<number>('user', data);

    const user = new User({
      ...data,
      id: res.data
    });
    bus.fire('user_created', user);
    return user;
  }

  public async update(data: IUserData) {
    await axios.put('user', data);
    const user = new User(data);

    bus.fire('user_updated', user);
    return user;
  }

  public async remove(id: number) {
    await axios.delete(`user/${id}`);
    bus.fire('user_removed', id);
  }

  private storeData(token: string | null) {
    if (token != null) {
      const { iat, exp, ...userInfo } = jwt.decode(token) as IPayload;

      this.accountExpiration = exp * 1000;

      this.currentUser = new User(userInfo);

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, token);

      bus.fire('user_authorized', this.currentUser);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN);

      this.currentUser = null;
    }
  }

  private restoreData() {
    const accessToken =
      localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN) || null;

    this.storeData(accessToken);
  }
}
