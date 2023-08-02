import * as IssueCheck from "./issueCheck.model";

export interface Issue {
  issueId: number;
  issueName: string;
  issueState: string;
  useTime: number;
  creationDate: string;
  user: string;
}

export interface CreateReq {
  issueName: string;
  user: string;
  issueChecks: IssueCheck.CreateReq[]
}

export interface UpdateReq {
  issueId: number;
  issueName: string;
  useTime: string;
  newIssueChecks: IssueCheck.CreateReq[]
  editIssueChecks: IssueCheck.UpdateReq[]
  deleteIssueChecks: IssueCheck.DeleteReq[]
}

export interface UpdateUseTimeReq {
  issueId: number;
}

export interface UpdateStateReq {
  issueId: number;
  issueState: string;
}

export interface DeleteReq {
  issueId: number;
}

export interface RetrieveReq {
  user: string;
}

export interface GetReq {
  issueId: number;
}

export interface RetrieveRes {
  issueId: number;
  issueName: string;
  issueState: string;
  useTime: number;
  creationDate: string; 
  issueChecks: IssueCheck.RetrieveRes[];
}

export enum State {
  WAIT = 'wait',
  START = 'start',
  COMPLETE = 'complete',
  END = 'end',
}