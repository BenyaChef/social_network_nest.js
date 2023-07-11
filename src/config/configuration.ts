import * as process from 'process';

export default () => {
  const MONGO_URI = process.env.MONGO_URI;
  const SECRET_KEY = process.env.SECRET_KEY;
  const EMAIL_SENDER = process.env.EMAIL_SENDER;
  const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

  return {
    MONGO_URI,
    SECRET_KEY,
    EMAIL_SENDER,
    EMAIL_PASSWORD,
  };
};
