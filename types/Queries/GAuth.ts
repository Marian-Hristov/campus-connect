import { User } from '../User';

export type RegisterInfo = {
  gid: string,
  email: string,
  refresh_token: string,
  access_token: string,
}

export type GAuthResponse = {
  user?: (User & {id : string});
  registerInfo?: RegisterInfo;
  error? : string;
}