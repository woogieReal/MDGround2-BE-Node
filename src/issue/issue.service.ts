import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { IssueRepository } from './issue.repository';
import * as Issue from './issue.model';
import { TransactionResult } from '../common/common.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { IssueStateHistoryRepository } from './issueStateHistory.repository';
import { PoolConnection } from 'mysql2/promise';
import * as IssueCheck from './issueCheck.model';
import { IssueCheckRepository } from './issueCheck.repository';
import { IssueCheckService } from './issueCheck.service';

@injectable()
export class IssueService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('IssueRepository') private repository: IssueRepository,
    @inject('IssueStateHistoryRepository') private issueStateHistoryRepository: IssueStateHistoryRepository,
    @inject('IssueCheckService') private issueCheckService: IssueCheckService,
    @inject('IssueCheckRepository') private issueCheckRepository: IssueCheckRepository,
  ) {}

  async insertIssue<T>(request: Issue.CreateReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const insertIssueResult: TransactionResult = await this.repository.insertIssue(request, connection);

      if (request.issueChecks.length) {
        request.issueChecks.forEach((issueCheck: IssueCheck.CreateReq, index: number, issueChecks: IssueCheck.CreateReq[]) => {
          issueChecks[index].issueId = insertIssueResult.insertId;
        })
        await this.issueCheckService.insertIssueCheck(request.issueChecks, connection);
      }

      return insertIssueResult;
    }, inputConnection);
  }

  async retrieveIssue<T>(request: Issue.RetrieveReq, inputConnection?: PoolConnection): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const issues: Issue.RetrieveRes[] = await this.repository.retrieveIssue(request, connection);
      const allIssueChecks: IssueCheck.RetrieveRes[] = await this.issueCheckRepository.retrieveAllIssueCheck(request, connection);

      issues.forEach((issue, index) => {
        const issueChecks = allIssueChecks.filter((issueCheck) => {
          return issueCheck.issueId === issue.issueId;
        });
        issue.issueChecks = issueChecks;
      });

      return issues;
    }, inputConnection);
  }

  async getIssue<T>(request: Issue.GetReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const issue: Issue.RetrieveRes = await this.repository.getIssue(request, connection);
      issue.issueChecks = await this.issueCheckService.retrieveIssueCheck({ issueId: issue.issueId }, connection) || [];
      return issue;
    }, inputConnection);
  }

  async updateIssue<T>(request: Issue.UpdateReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const updateIssueResult: TransactionResult =  await this.repository.updateIssue(request, connection);

      if (request.newIssueChecks.length) await this.issueCheckService.insertIssueCheck(request.newIssueChecks, connection);
      if (request.editIssueChecks.length) await this.issueCheckService.updateIssueCheck(request.editIssueChecks, connection);
      if (request.deleteIssueChecks.length) await this.issueCheckService.deleteIssueCheck(request.deleteIssueChecks, connection);

      return updateIssueResult;
    }, inputConnection);
  }

  async updateUseTime<T>(request: Issue.UpdateUseTimeReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateUseTime(request, connection);
    }, inputConnection);
  }

  async updateState<T>(request: Issue.UpdateStateReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      let result;
      
      const historyResult: TransactionResult = await this.issueStateHistoryRepository.insertIssueStateHistory(request, connection);
      if (historyResult.affectedRows !== 1) throw new Error;
      
      const stateResult: TransactionResult = await this.repository.updateState(request, connection);
      if (stateResult.affectedRows !== 1) throw new Error;
      
      result = historyResult;
      return result;
    }, inputConnection);
  }

  async deleteIssue<T>(request: Issue.DeleteReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.deleteIssue(request, connection);
    }, inputConnection);
  }

}
