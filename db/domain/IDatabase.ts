export interface IDatabase {
  getConnection(): Promise<any>
}
