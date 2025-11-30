export interface Address {
  address: string;
  city: string;
  zip_code: string;
  country: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: Address;
  date_of_birth: string;
  gender: string;
  created_at: string;
  last_login: string;
  is_active: boolean;
}

export interface UserCreateRequest
  extends Omit<
    UserResponse,
    "id" | "created_at" | "last_login" | "name" | "address"
  > {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
}

export interface UserResponseById extends Omit<UserResponse, "name"> {
  first_name: string;
  last_name: string;
}

export interface UserCreateResponse extends UserResponse {
  message: string;
}

export interface UserUpdateResponse extends UserResponse {
  message: string;
}
