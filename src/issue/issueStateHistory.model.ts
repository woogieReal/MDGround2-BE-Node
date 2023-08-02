export interface IssueStateHistory {
  issueId: number;
  historyId: number;
  historyState: string;
  creationData: string;
}

export interface CreateReq {
  issueId: number;
  historyState: string;
}