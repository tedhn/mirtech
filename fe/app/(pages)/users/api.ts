import {
  UserCreateRequest,
  UserCreateResponse,
  UserResponse,
  UserResponseById,
  UserUpdateResponse,
} from "./types";
import axios from "axios";

const CLIENT_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
export interface PaginatedResponse {
  data: UserResponse[];
  total: number;
  page: number;
  next?: number;
  page_size: number;
  total_pages: number;
}

export async function fetchUsers(
  page: number = 1,
  pageSize: number = 10,
  filter?: string,
  active?: string,
  gender?: string
): Promise<PaginatedResponse> {
  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("page_size", pageSize.toString());

  if (filter) {
    queryParams.append("filter", filter);
  }
  if (active) {
    queryParams.append("active", active);
  }
  if (gender) {
    queryParams.append("gender", gender.replaceAll(" ", "-"));
  }

  const { data } = await axios.get<PaginatedResponse>(
    `${CLIENT_API_BASE_URL}/users?${queryParams.toString()}`
  );

  return data;
}

export async function fetchUserById(id: string): Promise<UserResponseById> {
  const { data } = await axios.get<UserResponseById>(
    `${CLIENT_API_BASE_URL}/users/${id}`
  );
  return data;
}

export async function createUser(
  userData: UserCreateRequest
): Promise<UserCreateResponse> {
  const { data } = await axios.post<UserCreateResponse>(
    `${CLIENT_API_BASE_URL}/users`,
    userData
  );
  return data;
}

export async function updateUser(
  id: string,
  userData: Partial<UserCreateRequest>
): Promise<UserUpdateResponse> {
  const { data } = await axios.patch<UserUpdateResponse>(
    `${CLIENT_API_BASE_URL}/users/${id}`,
    userData
  );
  return data;
}

export async function deleteUser(
  id: string
): Promise<{ id: number; message: string }> {
  const { data } = await axios.delete<{ id: number; message: string }>(
    `${CLIENT_API_BASE_URL}/users/${id}`
  );
  return data;
}
