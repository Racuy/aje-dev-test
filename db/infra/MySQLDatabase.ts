import 'reflect-metadata'
import { DataSource, EntitySchema } from 'typeorm'
import { IDatabase } from '../domain/IDatabase'

class MySQLDatabase {
  private static instance: Promise<MySQLDatabase>
  private static entities: EntitySchema[] = []
  private dataSource: DataSource

  private constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  static configure(entities: EntitySchema[]): void {
    MySQLDatabase.entities = entities
  }

  private static async retry(dataSource: DataSource, attempts: number): Promise<void> {
    try {
      await dataSource.initialize()
    } catch {
      if (attempts === 0) throw new Error('Could not connect to database')
      await new Promise((res) => setTimeout(res, 3000))
      await MySQLDatabase.retry(dataSource, attempts - 1)
    }
  }

  private static async create(): Promise<MySQLDatabase> {
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'aje_dev_test_db',
      entities: MySQLDatabase.entities,
      synchronize: true,
    })
    await MySQLDatabase.retry(dataSource, 5)
    return new MySQLDatabase(dataSource)
  }

  private static getInstance(): Promise<MySQLDatabase> {
    if (!MySQLDatabase.instance) {
      MySQLDatabase.instance = MySQLDatabase.create()
    }
    return MySQLDatabase.instance
  }

  static async getConnection(): Promise<DataSource> {
    const instance = await MySQLDatabase.getInstance()
    return instance.dataSource
  }
}

export default MySQLDatabase
