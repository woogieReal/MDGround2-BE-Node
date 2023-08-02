import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { QueryInfo } from '../common/common.model';
import { IssueCheckQuery, IssueCheckQueryId } from './issueCheck.query';
import * as IssueCheck from './issueCheck.model';
import mysql from 'mysql2';

@injectable()
export class IssueCheckRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async insertIssueCheck<T>(request: IssueCheck.CreateReq[], connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.insertIssueCheck, request);
    return await this.insertByObj<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveIssueCheck<T>(request: IssueCheck.RetrieveReq, connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.retrieveIssueCheck, request);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateIssueCheck<T>(request: IssueCheck.UpdateReq[], connection?: any): Promise<T> {
    let queries = '';

    request.forEach((req: IssueCheck.UpdateReq, index: number) => {
      const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.updateIssueCheck, req);
      queries += mysql.format(queryInfo.query, queryInfo.queryParams) + '; ';
    });

    return await this.multiQuery(queries);
  }

  async updateIssueCheckCompleteYn<T>(request: IssueCheck.UpdateCompleteYnReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.updateIssueCheckCompleteYn, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async deleteIssueCheck<T>(request: IssueCheck.DeleteReq[], connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.deleteIssueCheck, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveAllIssueCheck<T>(request: IssueCheck.RetrieveAllReq, connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = IssueCheckQuery(IssueCheckQueryId.retrieveAllIssueCheck, request);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }
}