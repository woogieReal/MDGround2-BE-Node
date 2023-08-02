import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { IssueCheckRepository } from './issueCheck.repository';
import * as IssueCheck from './issueCheck.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { PoolConnection } from 'mysql2/promise';
import { TransactionResult } from '../common/common.model';

@injectable()
export class IssueCheckService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('IssueCheckRepository') private repository: IssueCheckRepository,
  ) {}

  async insertIssueCheck<T>(request: IssueCheck.CreateReq[], inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const insertIssueCheckResult: TransactionResult = await this.repository.insertIssueCheck(request, connection);
      if (insertIssueCheckResult.affectedRows !== request.length) {
        throw new Error;
      }
      return insertIssueCheckResult;
    }, inputConnection);
  }

  async retrieveIssueCheck<T>(request: IssueCheck.RetrieveReq, inputConnection?: PoolConnection): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveIssueCheck(request, connection);
    }, inputConnection);
  }

  async updateIssueCheck<T>(request: IssueCheck.UpdateReq[], inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      let updateIssueCheckResult: TransactionResult[] = await this.repository.updateIssueCheck(request, connection);
      updateIssueCheckResult = [...updateIssueCheckResult];
      updateIssueCheckResult.forEach((result: TransactionResult, index: number) => {
        if (result.affectedRows !== 1) {
          throw new Error;
        }
      });
      return updateIssueCheckResult;
    }, inputConnection);
  }

  async updateIssueCheckCompleteYn<T>(request: IssueCheck.UpdateCompleteYnReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateIssueCheckCompleteYn(request, connection);
    }, inputConnection);
  }

  async deleteIssueCheck<T>(request: IssueCheck.DeleteReq[], inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.deleteIssueCheck(request, connection);
    }, inputConnection);
  }

  async retrieveAllIssueCheck<T>(request: IssueCheck.RetrieveAllReq, inputConnection?: PoolConnection): Promise<T[]> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveAllIssueCheck(request, connection);
    }, inputConnection);
  }
}
