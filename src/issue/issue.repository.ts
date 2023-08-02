import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { QueryInfo } from '../common/common.model';
import { IssueQuery, IssueQueryId } from './issue.query';
import * as Issue from './issue.model';
import mysql from 'mysql2';

@injectable()
export class IssueRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async insertIssue<T>(request: Issue.CreateReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.insertIssue, request);
    return await this.insertByObj<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveIssue<T>(request: Issue.RetrieveReq, connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.retrieveIssue, request);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async getIssue<T>(request: Issue.GetReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.getIssue, request);
    const rows = await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
    return rows[0];
  }

  async updateIssue<T>(request: Issue.UpdateReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.updateIssue, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateUseTime<T>(request: Issue.UpdateUseTimeReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.updateUseTime, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateState<T>(request: Issue.UpdateStateReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.updateState, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async deleteIssue<T>(request: Issue.DeleteReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueQuery(IssueQueryId.deleteIssue, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }
}