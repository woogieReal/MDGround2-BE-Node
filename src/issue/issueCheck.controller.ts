import * as express from "express";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { IssueCheckService } from "./issueCheck.service";
import * as IssueCheck from './issueCheck.model';
import { ControllerType, MethodType, TransactionResult } from "../common/common.model";
import { CommonController } from "../common/common.controller";
import { UserSessionService } from "../userSession/userSession.service";
import * as userSession from '../userSession/userSession.model';

@controller("")
export class IssueCheckController extends CommonController implements interfaces.Controller {

  constructor( 
    @inject('IssueCheckService') private issueCheckService: IssueCheckService,
    @inject('UserSessionService') userSessionService: UserSessionService
  ) {
    super(userSessionService);
  }

  @httpPost("/issue/:id/issueCheck")
  async insertIssueCheck(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUS_CHECK, MethodType.CREATE, async (requestUser: userSession.getRes) => {
      const insertRequest: IssueCheck.CreateReq[] = request.body;
      return await this.issueCheckService.insertIssueCheck(insertRequest);
    });
  }

  @httpGet("/issue/:id/issueCheck")
  async retrieveIssueCheck(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUS_CHECK, MethodType.READ, async (requestUser: userSession.getRes) => {
      const searchRequest: IssueCheck.RetrieveReq = { issueId: Number(request.params.id) }
      return await this.issueCheckService.retrieveIssueCheck(searchRequest);
    });
  }

  @httpPut("/issue/:id/issueCheck/:checkId")
  async updateIssueCheck(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUS_CHECK, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: IssueCheck.UpdateReq[] = request.body;
      return await this.issueCheckService.updateIssueCheck(updateRequest);
    }, '이름');
  }

  @httpPut("/issue/:id/issueCheck/:checkId/completeYn")
  async updateIssueCheckCompleteYn(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUS_CHECK, MethodType.UPDATE, async (requestUser: userSession.getRes) => {
      const updateRequest: IssueCheck.UpdateCompleteYnReq = {
        issueId: Number(request.params.id),
        checkId: Number(request.params.checkId),
      };
      return await this.issueCheckService.updateIssueCheckCompleteYn(updateRequest);
    }, '완료여부');
  }

  @httpDelete("/issue/:id/issueCheck/:checkId")
  async deleteIssueCheck(@request() request: express.Request, @response() res: express.Response) {
    return await this.errorHandlingExecutor(request, ControllerType.ISSUS_CHECK, MethodType.DELETE, async (requestUser: userSession.getRes) => {
      const deleteRequest: IssueCheck.DeleteReq[] = request.body;
      return await this.issueCheckService.deleteIssueCheck(deleteRequest);
    });
  }
}