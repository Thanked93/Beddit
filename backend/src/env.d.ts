declare namespace NodeJS {
  export interface ProcessEnv {
    COOKIE_SECRET: string;
    DATABASE_NAME: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;
    PORT: string;
    CORS_ORIGIN: string;
  }
}
