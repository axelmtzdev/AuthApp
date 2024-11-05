import { User } from ".";

export interface RegisterResponse {
  user:  User;
  token: string;
}

