export interface IConfig {
  port: number;
  prettyLog: boolean;
}

export const config = {
  port: process.env.PORT || 8001,
  prettyLog: process.env.NODE_ENV === 'development'
} as IConfig;
