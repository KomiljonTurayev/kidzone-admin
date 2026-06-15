export interface UserDto {
  uid: string;
  displayName: string;
  email: string;
  ageGroup: string;
  status: 'active' | 'banned';
  fcmToken: string | null;
  createdAt: string | null;
  lastActiveAt: string | null;
}

export interface PagedUsersDto {
  users: UserDto[];
  total: number;
  page: number;
  size: number;
}

export interface DailyStatsDto {
  date: string;
  dau: number;
  totalSessions: number;
  totalMinutes: number;
}

export interface GameStatsDto {
  gameId: string;
  gameName: string;
  playCount: number;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
}

export interface PushResponse {
  success: boolean;
  messageId: string;
}
