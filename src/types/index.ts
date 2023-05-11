export interface AuthenticationSchema {
  email?: string | undefined;
  password?: string | undefined;
  username?: string | undefined;
  phoneNumber?: string | undefined;
}

export interface ChangePasswordPayloadSchema {
  email?: string | undefined;
  username?: string | undefined;
  phoneNumber?: string | undefined;
  password: string;
}

export interface UniqueFields {
  email?: string;
  phoneNumber?: string;
  username?: string;
}

export interface IResponse {
  status: string;
  accessToken: string;
  code: string;
  message: string;
}

export interface VerificationBodySchema {
  otp: string;
  email?: string;
  phoneNumber?: string;
}

export interface IFetchUsers {
  email?: string[];
  phoneNumber?: string[];
  username?: string[];
}
