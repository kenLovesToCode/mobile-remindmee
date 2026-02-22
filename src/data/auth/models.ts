export interface User {
  readonly id: string;
  readonly fullName: string;
  readonly email: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Account {
  readonly id: string;
  readonly userId: string;
  readonly provider: 'local';
  readonly providerAccountId: string;
  readonly passwordHash: string;
  readonly passwordSalt: string;
  readonly createdAt: string;
}

export interface Session {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: string;
  readonly lastActiveAt: string;
}
