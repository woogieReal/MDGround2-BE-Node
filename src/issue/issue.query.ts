import { QueryInfo } from '../common/common.model';

export enum IssueQueryId {
  insertIssue,
  retrieveIssue,
  getIssue,
  updateIssue,
  updateUseTime,
  updateState,
  deleteIssue,
}

export const IssueQuery = (queryId: IssueQueryId, request: any = {}) => {
  const result: QueryInfo = {
    query: ``,
    queryParams: [],
  };
  const query: string[] = [];
  const queryParams: any[] = [];

  switch(queryId) {
    case IssueQueryId.insertIssue:
      query.push(`
        INSERT INTO md2.issue
          (
            issue_name, 
            creation_date,
            user
          )
        VALUES
          (
            ?, 
            now(),
            ?
          )
      `);
      queryParams.push(request.issueName);
      queryParams.push(request.user);
      break;

    case IssueQueryId.retrieveIssue:
      query.push(`
        SELECT 
          issue_id AS issueId, 
          issue_name AS issueName, 
          issue_state AS issueState, 
          use_time AS useTime, 
          creation_date AS creationDate
        FROM md2.issue
        WHERE user = ?
      `);
      queryParams.push(request.user);
      break;

    case IssueQueryId.getIssue:
      query.push(`
        SELECT 
          issue_id AS issueId, 
          issue_name AS issueName, 
          issue_state AS issueState, 
          use_time AS useTime, 
          creation_date AS creationDate
        FROM md2.issue
        WHERE issue_id = ?
      `);
      queryParams.push(request.issueId);
      break;

    case IssueQueryId.updateIssue:
      query.push(`
        UPDATE md2.issue
        SET 
          issue_name = ?
          ,use_time = ?
        WHERE issue_id = ?
      `);
      queryParams.push(request.issueName);
      queryParams.push(request.useTime);
      queryParams.push(request.issueId);
      break;

    case IssueQueryId.updateUseTime:
      query.push(`
        UPDATE md2.issue
        SET use_time = use_time + (
          SELECT ROUND(
            TIMESTAMPDIFF(
              minute, 
              (
                SELECT MAX(ish1.creation_data) 
                FROM md2.issue_state_history ish1
                WHERE ish1.issue_id = ?
                AND ish1.creation_data NOT IN (
                  SELECT MAX(ish2.creation_data)
                  FROM md2.issue_state_history ish2
                )
              ), 
              (
                SELECT MAX(ish3.creation_data) 
                FROM md2.issue_state_history ish3
                WHERE md2.ish3.issue_id = ?
              )
            )/60
            , 1
          )
        )
        WHERE issue_id = ?
      `);
      queryParams.push(request.issueId);
      queryParams.push(request.issueId);
      queryParams.push(request.issueId);
      break;

    case IssueQueryId.updateState:
      query.push(`
        UPDATE md2.issue
        SET issue_state = ?
        WHERE issue_id = ?
      `);
      queryParams.push(request.issueState);
      queryParams.push(request.issueId);
      break;

    case IssueQueryId.deleteIssue:
      query.push(`
        DELETE FROM md2.issue
        WHERE issue_id = ?
      `);
      queryParams.push(request.issueId);
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