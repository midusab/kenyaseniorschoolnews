import fs from 'fs/promises';
import path from 'path';
import { School, NewsArticle, Scholarship } from '../../../src/types';
import { MOCK_SCHOOLS, MOCK_ARTICLES, MOCK_SCHOLARSHIPS } from '../../../src/data/mockData';

const DB_PATH = path.join(process.cwd(), 'server-db.json');

export interface DatabaseSchema {
  users: any[];
  schools: School[];
  articles: NewsArticle[];
  scholarships: Scholarship[];
}

class JSONDatabase {
  private data: DatabaseSchema | null = null;
  private isLoaded = false;

  private async initializeDB() {
    if (this.isLoaded) return;
    try {
      await fs.access(DB_PATH);
      const raw = await fs.readFile(DB_PATH, 'utf-8');
      this.data = JSON.parse(raw);
      this.isLoaded = true;
      console.log('Database loaded successfully from server-db.json');
    } catch (err) {
      console.log('Database file not found, bootstrapping with seed data...');
      this.data = {
        users: [
          {
            id: 'usr-admin',
            email: 'midusabrian@gmail.com',
            name: 'Brian Midusa',
            role: 'school_admin',
            schoolId: 'alliance'
          },
          {
            id: 'usr-student',
            email: 'student@kssnn.ke',
            name: 'Alex Waiganjo',
            role: 'student_reporter',
            schoolId: 'alliance'
          }
        ],
        schools: MOCK_SCHOOLS,
        articles: MOCK_ARTICLES,
        scholarships: MOCK_SCHOLARSHIPS
      };
      await this.save();
      this.isLoaded = true;
    }
  }

  private async save() {
    if (!this.data) return;
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing to database:', err);
    }
  }

  // Generic DB Methods imitating Mongoose
  public async find<K extends keyof DatabaseSchema>(collection: K): Promise<DatabaseSchema[K]> {
    await this.initializeDB();
    return this.data![collection];
  }

  public async findOne<K extends keyof DatabaseSchema>(
    collection: K,
    predicate: (item: any) => boolean
  ): Promise<any | null> {
    await this.initializeDB();
    const items = this.data![collection];
    return items.find(predicate) || null;
  }

  public async create<K extends keyof DatabaseSchema>(
    collection: K,
    item: any
  ): Promise<any> {
    await this.initializeDB();
    const newItem = { ...item, id: item.id || `id-${Date.now()}-${Math.floor(Math.random() * 10000)}` };
    (this.data![collection] as any[]).push(newItem);
    await this.save();
    return newItem;
  }

  public async updateOne<K extends keyof DatabaseSchema>(
    collection: K,
    predicate: (item: any) => boolean,
    updateFields: Partial<any>
  ): Promise<any | null> {
    await this.initializeDB();
    const collectionList = this.data![collection] as any[];
    const index = collectionList.findIndex(predicate);
    if (index === -1) return null;

    const updated = { ...collectionList[index], ...updateFields };
    collectionList[index] = updated;
    await this.save();
    return updated;
  }

  public async deleteOne<K extends keyof DatabaseSchema>(
    collection: K,
    predicate: (item: any) => boolean
  ): Promise<boolean> {
    await this.initializeDB();
    const collectionList = this.data![collection] as any[];
    const index = collectionList.findIndex(predicate);
    if (index === -1) return false;

    collectionList.splice(index, 1);
    await this.save();
    return true;
  }
}

export const db = new JSONDatabase();

export async function connectDB() {
  // Mock DB connection establishment
  console.log('Connecting to Local JSON Database Engine...');
  return db;
}
