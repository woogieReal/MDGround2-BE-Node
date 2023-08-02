import { inject, injectable } from 'inversify';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';

@injectable()
export class CommonRepository {
  constructor(
      @inject('mysqlPool') protected mysqlPool: DBConnectionFactory
  ){}

  protected init() {

  }

  protected async query<T>(queryStr: string, parameters?: any[], conn?: any): Promise<T[]> {
    console.log('쿼리: ' + queryStr);
    console.log('파람: ' + parameters);
    
    let result: T[];
    let connection;

    try {
      if(conn) {
          connection = conn;
      } else {
          connection = await this.mysqlPool.getConnection();
      }

      const [rows, fields] = await connection.query(queryStr, parameters);
      result = rows as T[];
      if(!conn) {
          await connection.commit();
      }
    } catch(err) {
      if(!conn) {
          await connection.rollback();
      }
      throw err;
    } finally {
      if(!conn) {
          await connection.release();
      }
    }
    return result;
  }
  
  protected async execute<T>(queryStr: string, parameters?: any[], conn?: any): Promise<T> {
    console.log('쿼리: ' + queryStr);
    console.log('파람: ' + parameters);

    let result: T;
    let connection;

    try {
      if(conn) {
          connection = conn;
      } else {
          connection = await this.mysqlPool.getConnection();
      }

      await connection.query('SET AUTOCOMMIT = FALSE;');
      const [rows, fields] = await connection.execute(queryStr, parameters);
      result = rows as T;
      if(!conn) {
          await connection.commit();
      }
    } catch(err) {
      if(!conn) {
          await connection.rollback();
      }
      throw err;
    } finally {
      if(!conn) {
          await connection.release();
      }
    }
    return result;
  }

  protected async insertByObj<T>(queryStr: string, paramObj?: any, conn?: any): Promise<T> {
    console.log('쿼리: ' + queryStr);
    console.log('파람: ' + paramObj);


    let result: T;
    let connection;

    try {
      if(conn) {
          connection = conn;
      } else {
          connection = await this.mysqlPool.getConnection();
      }

      await connection.query('SET AUTOCOMMIT = FALSE;');
      const [rows, fields] = await connection.query(queryStr, paramObj);
      result = rows as T;
      if(!conn) {
          await connection.commit();
      }
    } catch(err) {
      if(!conn) {
          await connection.rollback();
      }
      throw err;
    } finally {
      if(!conn) {
          await connection.release();
      }
    }
    return result;
  }
  
  protected async multiQuery(queries: string, conn?: any): Promise<any> {
    console.log('쿼리: ' + queries);

    let result;
    let connection;

    try {
      if (conn) {
        connection = conn;
      } else {
        connection = await this.mysqlPool.getConnection();
      }

      await connection.query('SET AUTOCOMMIT = FALSE;');
      const [rows, fields] = await connection.query(queries);
      result = rows;
      if (!conn) {
        await connection.commit();
      }
    } catch (err) {
      if (!conn) {
        await connection.rollback();
      }
      throw err;
    } finally {
      if (!conn) {
        await connection.release();
      }
    }
    return result;
  }
    
}