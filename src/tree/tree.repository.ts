import { inject, injectable } from 'inversify';
import { CommonRepository } from '../common/common.repository';
import * as Tree from './tree.model';
import { QueryInfo } from '../common/common.model';
import { TreeQuery, TreeQueryId } from './tree.query';

@injectable()
export class TreeRepository extends CommonRepository {
  constructor(
    @inject('mysqlPool') mysqlPool: any
  ) {
    super(mysqlPool);
    this.init();
  }

  async getNextTreeIdByUser<T>(request: Tree.GetNextTreeIdReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.getNextTreeIdByUser, request);
    const rows = await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
    return rows[0];
  }

  async insertTree<T>(request: Tree.CreateReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.insertTree, request);
    return await this.insertByObj<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveTree<T>(request: Tree.RetrieveReq, connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.retrieveTree, request);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateTree<T>(request: Tree.UpdateReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.updateTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async retrieveDeleteTarget<T>(request: Tree.RetrieveDeleteTargetReq, connection?: any): Promise<T[]> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.retrieveDeleteTarget, request);
    return await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async deleteTree<T>(request: Tree.DeleteMultipleReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.deleteTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateSeqSurroundingTree<T>(request: Tree.UpdateSeqReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.updateSeqSurroundingTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateSeqTargetTree<T>(request: Tree.UpdateSeqReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.updateSeqTargetTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async getTree<T>(request: Tree.GetReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.getTree, request);
    const rows = await this.query<T>(queryInfo.query, queryInfo.queryParams, connection);
    return rows[0];
  }

  async correctSeqTargetTree<T>(request: Tree.CorrectSeqReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.correctSeqTargetTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }

  async updateLocationTree<T>(request: Tree.UpdateLocationReq, connection?: any): Promise<T> {
    const queryInfo: QueryInfo = TreeQuery(TreeQueryId.updateLocationTree, request);
    return await this.execute<T>(queryInfo.query, queryInfo.queryParams, connection);
  }
}