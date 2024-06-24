// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session';
// import type { User } from 'pages/api/user';

export const sessionOptions: IronSessionOptions = {
  password: process.env.IRON_SESSION_KEY as string,
  cookieName: 'givecredit_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production'
  }
};

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  interface IronSessionData {
    ott: string;
    wallet: string;
    jwt: string;
  }
}
