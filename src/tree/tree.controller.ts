import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { TreeService } from "./tree.service";
import { MethodType, ControllerType, TransactionResult } from '../common/common.model';
import * as Tree from './tree.model';
import { CommonController } from "../common/common.controller";
import * as userSession from '../userSession/userSession.model';
import { UserSessionService } from "../userSession/userSession.service";
import { FileController } from '../common/file.controller';

@controller("")
export class TreeController extends CommonController implements interfaces.Controller {

  constructor( 
    @inject('TreeService') private treeService: TreeService,
    @inject('UserSessionService') userSessionService: UserSessionService,
    @inject('FileController') private fileController: FileController,
  ) {
    super(userSessionService);
  }

  @httpGet("/")
  private index(request: express.Request, res: express.Response, next: express.NextFunction): string {
    return "success!";
  }

  @httpPost("/tree")
  async insertTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.CREATE, async (requestUser: userSession.getRes) => {
      const insertRequest: Tree.CreateReq = request.body; 
      insertRequest.user = requestUser.userName;
      const result: Tree.GetNextTreeIdRes = await this.treeService.insertTree(insertRequest);
      const insertedTree: Tree.RetrieveRes = await this.treeService.getTree({ id: result.nextTreeId, user: requestUser.userName });
      return insertedTree;
    });
  }
    
  @httpGet("/tree")
  async retrieveTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.READ, async (requestUser: userSession.getRes) => {
      const searchRequest: Tree.RetrieveReq = {
        parent: request.query.parent ? Number(request.query.parent) : 0,
        user: requestUser.userName,
      };
      return await this.treeService.retrieveTree(searchRequest);
    });
  }

  @httpGet("/tree/:id")
  async getTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.READ, async (requestUser: userSession.getRes) => {
      const getRequest: Tree.GetReq = {
        id: Number(request.params.id),
        user: requestUser.userName
      };
      return await this.treeService.getTree(getRequest);
    }, '개별');
  }

  @httpPut("/tree/:id")
  async updateTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: Tree.UpdateReq = request.body;
      updateRequest.id = Number(request.params.id);
      updateRequest.user = requestUser.userName;
      const result: TransactionResult = await this.treeService.updateTree(updateRequest);
      if (result.affectedRows !== 1) {
        throw new Error(JSON.stringify(result));
      }

      const updatedTree: Tree.RetrieveRes = await this.treeService.getTree({ id: updateRequest.id, user: requestUser.userName });
      return updatedTree;
    });
  }

  @httpDelete("/tree/:id")
  async deleteTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.DELETE, async (requestUser: userSession.getRes) => {
      const deleteRequest: Tree.DeleteReq = request.body;
      deleteRequest.id = Number(request.params.id);
      deleteRequest.user = requestUser.userName;
      return await this.treeService.deleteTree(deleteRequest);
    });
  }

  @httpPut("/tree/:id/seq")
  async updateSeqTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateSeqRequest: Tree.UpdateSeqReq = request.body;
      updateSeqRequest.id = Number(request.params.id);
      updateSeqRequest.user = requestUser.userName;
      const result: TransactionResult = await this.treeService.updateSeqTree(updateSeqRequest);
      if (result.affectedRows !== 1) {
        throw new Error(JSON.stringify(result));
      }

      const updatedTree: Tree.RetrieveRes = await this.treeService.getTree({ id: updateSeqRequest.id, user: requestUser.userName });
      return updatedTree;
    });
  }

  @httpPut("/tree/:id/seq/correct")
  async correctSeqTargetTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const correctSeqRequest: Tree.CorrectSeqReq = request.body;
      correctSeqRequest.parent = Number(request.params.id);
      correctSeqRequest.user = requestUser.userName;
      return await this.treeService.correctSeqTargetTree(correctSeqRequest);
    }, 'seq 바로잡기');
  }

  @httpPut("/tree/:id/children")
  async updateLocationTree(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.TREE, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: Tree.UpdateLocationReq = request.body;
      updateRequest.parent = Number(request.params.id);
      updateRequest.user = requestUser.userName;
      console.log('update location tree=========================================');
      const result: TransactionResult = await this.treeService.updateLocationTree(updateRequest);
      return result;
    }, '이동');
  }

  @httpPost("/upload")
  async insertTreeFile(@request() req: express.Request, @response() res: express.Response) {
    const filesPaths: string[] = await this.fileController.handleUploadFilesToS3(req, 'files');
    return { paths: filesPaths }
  }
}