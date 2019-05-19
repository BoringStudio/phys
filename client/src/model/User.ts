import axios from 'axios';
import Vue from 'vue';
import jwt from 'jsonwebtoken';

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
  middlename?: string;
  fullAccess: boolean;
}

export class User implements IUserData {
  public id: number;
  public login: string;
  public surname: string;
  public name: string;
  public middlename?: string;
  public fullAccess: boolean;

  constructor(data: IUserData) {
    this.id = data.id;
    this.login = data.login;
    this.surname = data.surname;
    this.name = data.name;
    this.middlename = data.middlename;
    this.fullAccess = data.fullAccess;
  }
}

export class UserManager {
  public currentUser: User | null = null;

  public users: User[] = [];

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
    return this.currentUser != null;
  }

  private storeData(token: string | null) {
    if (token != null) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, token);

      this.currentUser = new User(jwt.decode(token) as IUserData);
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
