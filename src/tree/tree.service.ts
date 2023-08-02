import { inject, injectable } from 'inversify';
import { CommonService } from '../common/common.service';
import { PoolConnection } from 'mysql2/promise';
import { TreeRepository } from './tree.repository';
import * as Tree from './tree.model';
import { DBConnectionFactory } from '../utils/dbConnectionFactory.util';
import { TransactionResult } from '../common/common.model';

@injectable()
export class TreeService {
  constructor(
    @inject('mysqlPool') protected mysqlPool: DBConnectionFactory,
    @inject('CommonService') protected commonService: CommonService,
    @inject('TreeRepository') private repository: TreeRepository
  ) {}

  async insertTree<T>(request: Tree.CreateReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
        const nextTreeIdRes: Tree.GetNextTreeIdRes = await this.repository.getNextTreeIdByUser({ user: request.user }, connection);
        request.id = nextTreeIdRes.nextTreeId;
        const result: TransactionResult = await this.repository.insertTree(request, connection);
        console.log(result);
        if (result.affectedRows === 1) {
          return  nextTreeIdRes;
        } else {
          throw new Error;
        }
    }, inputConnection)
  }

  
  async retrieveTree<T>(request: Tree.RetrieveReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.retrieveTree(request, connection);
    }, inputConnection)
  }

  async updateTree<T>(request: Tree.UpdateReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.updateTree(request, connection);
    }, inputConnection)
  }

  async deleteTree<T>(request: Tree.DeleteReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const deleteTargetMinus = [];
      const deleteTargetPlus = [];

      deleteTargetMinus.push(request.id);
      deleteTargetPlus.push(request.id);

      let requestDeleteTarget: number = 0;

      while (deleteTargetMinus.length > 0) {
        requestDeleteTarget = Number(deleteTargetMinus.pop());
        const retrieveDeleteTargetReq: Tree.RetrieveDeleteTargetReq = {
          id: requestDeleteTarget,
          user: request.user
        }
        let targetChildren: Tree.RetrieveRes[] = await this.repository.retrieveDeleteTarget(retrieveDeleteTargetReq, connection);
        for (let child of targetChildren) {
          deleteTargetMinus.push(child.id);
          deleteTargetPlus.push(child.id);
        }
      }
      console.log(deleteTargetPlus);

      const finalRequest: Tree.DeleteMultipleReq = {
        ids: deleteTargetPlus.toString(),
        user: request.user,
      };
      return await this.repository.deleteTree(finalRequest);
    }, inputConnection);
  }

  async updateSeqTree<T>(request: Tree.UpdateSeqReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const result: TransactionResult = await this.repository.updateSeqSurroundingTree(request, connection);
      if (result.affectedRows === 1) {
        return await this.repository.updateSeqTargetTree(request, connection);
      } else {
        throw new Error;
      }
    }, inputConnection)
  }

  async getTree<T>(request: Tree.GetReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.getTree(request, connection);
    }, inputConnection)
  }

  async correctSeqTargetTree<T>(request: Tree.CorrectSeqReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      return await this.repository.correctSeqTargetTree(request, connection);
    }, inputConnection)
  }

  async updateLocationTree<T>(request: Tree.UpdateLocationReq, inputConnection?: PoolConnection): Promise<T> {
    return await this.commonService.transactionExecutor(async (connection: PoolConnection) => {
      const result: TransactionResult = await this.repository.updateLocationTree(request, connection);
      if (result.affectedRows > 0) {
        await this.correctSeqTargetTree({ parent: request.parent, user: request.user });
      } else {
        throw new Error;
      }
      return result;
    }, inputConnection)
  }
}
