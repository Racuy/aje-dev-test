import 'reflect-metadata'
import { DataSource } from 'typeorm'
class MySQLDatabase {
  private static instance: Promise<MySQLDatabase>
  private dataSource: DataSource

  private constructor(dataSource: DataSource) {
    this.dataSource = dataSource
  }

  private static async create(): Promise<MySQLDatabase> {
    const dataSource = new DataSource({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'aje_dev_test_db',
      entities: [],
      synchronize: true,
    })
    await dataSource.initialize()
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
