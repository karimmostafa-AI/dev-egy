import { type User, type InsertUser } from "@shared/schema-sqlite";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    // Create a mock password hash since we don't have the actual hashing logic here
    const passwordHash = `hashed_${insertUser.password || 'default'}`;
    const user: User = { 
      ...insertUser,
      id,
      passwordHash,
      role: 'customer', // Default role for new users
      createdAt: now,
      updatedAt: now
    } as User;
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
