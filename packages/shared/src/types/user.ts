export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
}
