import * as process from 'process';

export default () => {
  const MONGO_URI = process.env.MONGO_URI;
  const SECRET_KEY = process.env.SECRET_KEY;
  const SMTP_SERVER = process.env.SMTP_SERVER;
  const EMAIL_SENDER = process.env.EMAIL_SENDER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
  const EXPIRATION_ACCESS = process.env.EXPIRATION_ACCESS;
  const EXPIRATION_REFRESH = process.env.EXPIRATION_REFRESH;

  return {
    MONGO_URI,
    SECRET_KEY,
    SMTP_SERVER,
    EMAIL_SENDER,
    EMAIL_PASSWORD,
    EXPIRATION_ACCESS,
    EXPIRATION_REFRESH,
  };
};
