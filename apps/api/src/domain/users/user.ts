export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface PublicUser {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Favorite {
  id: string;
  currency: string;
  createdAt: Date;
  userId: string;
}
