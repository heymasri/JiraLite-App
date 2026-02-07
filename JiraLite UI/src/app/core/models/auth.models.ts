export interface RegisterDto {
  email: string;
  fullName: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface MeResponse {
  id: string;
  email: string;
}