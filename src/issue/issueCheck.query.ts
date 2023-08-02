import { QueryInfo } from '../common/common.model';

export enum IssueCheckQueryId {
  insertIssueCheck,
  retrieveIssueCheck,
  updateIssueCheck,
  updateIssueCheckCompleteYn,
  deleteIssueCheck,
  retrieveAllIssueCheck,
}

export const IssueCheckQuery = (queryId: IssueCheckQueryId, request: any = {}) => {
  const result: QueryInfo = {
    query: ``,
    queryParams: [],
  };
  const query: string[] = [];
  const queryParams: any[] = [];

  switch(queryId) {
    case IssueCheckQueryId.insertIssueCheck:
      query.push(`
        INSERT INTO md2.issue_check
          (
            issue_id, 
            check_id, 
            check_name, 
            creation_date
          )
        VALUES
      `);

      request.forEach((req: any, index: number) => {
        query.push(`
            (
              ?, 
              (
                SELECT IFNULL(MAX(ic.check_id), 0) + 1 
                FROM md2.issue_check ic
                WHERE ic.issue_id = ?
              ), 
              ?, 
              now()
            )
        `);
        queryParams.push(req.issueId);
        queryParams.push(req.issueId);
        queryParams.push(req.checkName);

        if (index+1 !== request.length) query.push(`,`);
      });
      break;

    case IssueCheckQueryId.retrieveIssueCheck:
      query.push(`
        SELECT 
          issue_id AS issueId, 
          check_id AS checkId, 
          check_name AS checkName, 
          complete_yn AS completeYn, 
          creation_date AS creationDate
        FROM md2.issue_check
        WHERE issue_id = ?
      `);
      queryParams.push(request.issueId);
      break;

    case IssueCheckQueryId.updateIssueCheck:
      query.push(`
        UPDATE md2.issue_check
        SET check_name = ?
        WHERE issue_id = ? 
        AND check_id = ?
      `);
      queryParams.push(request.checkName);
      queryParams.push(request.issueId);
      queryParams.push(request.checkId);
      break;

    case IssueCheckQueryId.updateIssueCheckCompleteYn:
      query.push(`
        UPDATE md2.issue_check
        SET complete_yn = IF(complete_yn = 'N', 'Y', 'N')
        WHERE issue_id = ? 
        AND check_id = ?
      `);
      queryParams.push(request.issueId);
      queryParams.push(request.checkId);
      break;

    case IssueCheckQueryId.deleteIssueCheck:
      query.push(`
        DELETE 
        FROM md2.issue_check
        WHERE issue_id = ? 
        AND check_id IN (
      `);
      queryParams.push(request[0].issueId);

      request.forEach((req: any, index: number) => {
        query.push(` ? `);
        queryParams.push(req.checkId);

        if (index+1 !== request.length) query.push(`,`);
      });

      query.push(` ) `)
      break;

    case IssueCheckQueryId.retrieveAllIssueCheck:
      query.push(`
        SELECT 
          issue_id AS issueId, 
          check_id AS checkId, 
          check_name AS checkName, 
          complete_yn AS completeYn, 
          creation_date AS creationDate
        FROM md2.issue_check
      `);
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