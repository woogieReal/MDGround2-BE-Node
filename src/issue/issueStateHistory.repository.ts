import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import { QueryInfo } from '../common/common.model';
import { IssueStateHistoryQuery, IssueStateHistoryQueryId } from './issueStateHistory.query';
import * as Issue from './issue.model';

@injectable()
export class IssueStateHistoryRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async insertIssueStateHistory<T>(request: Issue.UpdateStateReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = IssueStateHistoryQuery(IssueStateHistoryQueryId.insertIssueStateHistory, request);
    return await this.insertByObj<T>(queryInfo.query, queryInfo.queryParams, connection);
  }
}