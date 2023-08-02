import { QueryInfo } from '../common/common.model';

export enum UserSessionQueryId {
  getUserSession
}

export const UserSessionQuery = (queryId: UserSessionQueryId, request: any = {}) => {
  const result: QueryInfo = {
    query: ``,
    queryParams: [],
  };
  const query: string[] = [];
  const queryParams: any[] = [];

  switch(queryId) {
    case UserSessionQueryId.getUserSession:
      query.push(`
        SELECT
          user_id AS userId
          ,user_name AS userName
          ,session_id AS sessionId
        FROM auth.user_session
        WHERE session_id = ?
      `);
      queryParams.push(request.sessionId);
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