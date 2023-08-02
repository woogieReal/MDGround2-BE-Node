import mysql, {Pool, PoolConnection, PoolOptions} from 'mysql2/promise';
import { inject, injectable } from 'inversify';
import 'dotenv/config'

@injectable()
export class DBConnectionFactory {

	private static pool: Pool;
	private static instance: PoolConnection;

	public async getConnection(): Promise<PoolConnection> {
		const options: PoolOptions = {
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			waitForConnections: true,
			connectionLimit: 5,
			multipleStatements: true,
			queueLimit: 0,
			keepAliveInitialDelay: 10000, // 0 by default.
			enableKeepAlive: true, // false by default.
		};
		
		try {
			if (!DBConnectionFactory.pool) {
        DBConnectionFactory.pool = mysql.createPool(options);
      }

			if (!DBConnectionFactory.instance) {
        DBConnectionFactory.instance = await DBConnectionFactory.pool.getConnection();
      }

			if (!DBConnectionFactory.instance.ping()) {
        DBConnectionFactory.instance = await DBConnectionFactory.pool.getConnection();
      }
		} catch(error) {
			throw error;
		} finally {
			DBConnectionFactory.instance.release();
		}
		return DBConnectionFactory.instance;
	}
}