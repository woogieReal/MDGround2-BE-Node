import { QueryInfo } from '../common/common.model';

export enum IssueStateHistoryQueryId {
  insertIssueStateHistory,
}

export const IssueStateHistoryQuery = (queryId: IssueStateHistoryQueryId, request: any = {}) => {
  const result: QueryInfo = {
    query: ``,
    queryParams: [],
  };
  const query: string[] = [];
  const queryParams: any[] = [];

  switch(queryId) {
    case IssueStateHistoryQueryId.insertIssueStateHistory:
      query.push(`
        INSERT INTO md2.issue_state_history
          (
            issue_id, 
            history_id, 
            history_state, 
            creation_data
          )
        VALUES
          (
            ?, 
            (
              SELECT IFNULL(MAX(ish.history_id), 0) + 1 
              FROM md2.issue_state_history ish
              WHERE ish.issue_id = ?
            ), 
            ?, 
            now()
          )      
      `);
      queryParams.push(request.issueId);
      queryParams.push(request.issueId);
      queryParams.push(request.issueState);
      break;

    default:
      break;
  }

  if(query.length > 0) {
      result.query = query.join(' ');
      result.queryParams = queryParams;
  }

  return result;
}