import * as express from "express";
import { inject, injectable } from 'inversify';
import { next, request, response } from 'inversify-express-utils';
import * as userSession from '../userSession/userSession.model';
import { UserSessionService } from '../userSession/userSession.service';
import { Message, MethodType, ControllerType, TransactionResult } from "./common.model";

@injectable()
export class CommonController {
  constructor(
    @inject('UserSessionService') protected userSessionService: UserSessionService
  ) {}

  async getUserSession(@request() request: express.Request): Promise<userSession.getRes> {
    return await this.userSessionService.getUserSession({ sessionId: request.cookies['JSESSIONID'] });
  }

  async errorHandlingExecutor(
    @request() request: express.Request
    ,controllerType: ControllerType
    ,methodType: MethodType
    ,callback: (requestUser: userSession.getRes) => Promise<any>
    ,methodDetail?: string
  ): Promise<any> {
    let requestUser: userSession.getRes;
    let result: any;
    let success: boolean = true;

    methodDetail = methodDetail ? `_${methodDetail}` : '';
    console.log(`${controllerType}_${methodType}${methodDetail} =========================================`);
    methodType === MethodType.READ ? console.log('request.query:', request.query) : console.log('request.body:', request.body);

    try {
      requestUser = await this.getUserSession(request);
      if (!requestUser) {
        throw new Error('Invalid Session');
      }

      result = await callback(requestUser);
    } catch(err) {
      console.log(err);
      if (err instanceof Error) {
        result = String(err.message);
      } else {
        result = String(err);
      }
      success = false;
      next();

    } finally {
      return this.createReturnMessage(controllerType, result, methodType, success, methodDetail);
    }
  }

  createReturnMessage(controllerType: ControllerType , result: TransactionResult | any, methodType: MethodType, success = true, methodDetail?: string): any {
    let returnMessage: Message = {
      msId: 0,
      msContent: '',
      msObject: null
    };

    returnMessage.msContent += controllerType;
    returnMessage.msContent += methodType;

    if (success) {
      returnMessage.msId = 1;
      returnMessage.msContent += '에 성공하였습니다.';
    } else {
      returnMessage.msId = 0;
      returnMessage.msContent += '에 실패하였습니다.';
    }

    returnMessage.msObject = result;
    
    if (methodType !== MethodType.READ) console.log(`메세지: \n ${returnMessage}`);
    console.log(`========================================= ${controllerType}_${methodType}${methodDetail}`);
    return returnMessage;
  }
}