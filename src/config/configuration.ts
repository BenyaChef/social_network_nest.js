import * as process from 'process';

export default () => {

  // const MONGO_URI = process.env.MONGO_URI;
  const SECRET_KEY = process.env.SECRET_KEY;
  const SMTP_SERVER = process.env.SMTP_SERVER;
  const EMAIL_SENDER = process.env.EMAIL_SENDER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  const EXPIRATION_ACCESS = process.env.EXPIRATION_ACCESS;
  const EXPIRATION_REFRESH = process.env.EXPIRATION_REFRESH
  const POSTGRESQL_NAME = process.env.POSTGRESQL_NAME
  const POSTGRESQL_PASS = process.env.POSTGRESQL_PASS
  const POSTGRESQL_HOST = process.env.POSTGRESQL_HOST
  const POSTGRESQL_DB = process.env.POSTGRESQL_DB

  return {
    // MONGO_URI,
    SECRET_KEY,
    SMTP_SERVER,
    EMAIL_SENDER,
    EMAIL_PASSWORD,
    EXPIRATION_ACCESS,
    EXPIRATION_REFRESH,
    POSTGRESQL_NAME,
    POSTGRESQL_PASS,
    POSTGRESQL_HOST,
    POSTGRESQL_DB
  };
};
