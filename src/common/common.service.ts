import { inject, injectable } from 'inversify';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { PoolConnection } from 'mysql2/promise';

@injectable()
export class CommonService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
  ) {}

  async transactionExecutor<T>(
    callback: (connection: PoolConnection) => Promise<any> | void,
    inputConnection: PoolConnection | null = null
  ) {
    let connection: PoolConnection;
    let result: any;

    if (inputConnection) {
      connection = inputConnection;
    } else {
      connection = await this.mysqlPool.getConnection();
      await connection.beginTransaction();
    }

    try {
      result = await callback(connection);
      if (!inputConnection) await connection.commit();
    } catch (err) {
      if (!inputConnection) await connection.rollback();
      console.log(err);
      throw err;
    } finally {
      if (!inputConnection && connection) connection.release();
    }
    return result;
  }

  // inputConnection 없을 때 
  // async insertTree<T>(request: Tree): Promise<T> {
  //   return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
  //       return await this.repository.insertTree(request, connection)
  //   })
  // }

  // inputConnection 있을 때
  // async insertTree<T>(request: Tree): Promise<T> {
  //   let connection: PoolConnection = await this.mysqlPool.getConnection();
  //   let result: any;
  //   try {
  //     result = await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
  //       return await this.repository.insertTree(request, connection)
  //     }, connection)
  //   } catch (err) {
  //     connection?.rollback();
  //     throw err;
  //   } finally {
  //     if (connection) {
  //       connection.release();
  //     }
  //   }
  //   return result;
  // }

  
}
