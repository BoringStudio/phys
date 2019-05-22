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

interface IPayload extends IUserData {
  iat: number;
  exp: number;
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

  public get fullName() {
    return (
      `${this.surname} ${this.name}` +
      (this.middlename ? ` ${this.middlename}` : '')
    );
  }
}

export class UserManager {
  public currentUser: User | null = null;

  public users: User[] = [];

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

  private storeData(token: string | null) {
    if (token != null) {
      const { iat, exp, ...userInfo } = jwt.decode(token) as IPayload;

      this.accountExpiration = exp * 1000;

      this.currentUser = new User(userInfo);

      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN, token);
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
