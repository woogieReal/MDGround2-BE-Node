import { QueryInfo } from '../common/common.model';
import { UpDown } from './tree.model';

export enum TreeQueryId {
  getNextTreeIdByUser,
  insertTree,
  updateTree,
  deleteTree,
  retrieveTree,
  retrieveDeleteTarget,
  updateSeqSurroundingTree,
  updateSeqTargetTree,
  getTree,
  correctSeqTargetTree,
  updateLocationTree,
}

export const TreeQuery = (queryId: TreeQueryId, request: any = {}) => {
  const result: QueryInfo = {
    query: ``,
    queryParams: [],
  };
  const query: string[] = [];
  const queryParams: any[] = [];

  switch(queryId) {
    case TreeQueryId.getNextTreeIdByUser:
      query.push(`
        SELECT IFNULL(MAX(tr.id), 0) + 1 AS nextTreeId
        FROM md2.tree tr
        WHERE tr.user = ?
      `);
      queryParams.push(request.user);
      break;

    case TreeQueryId.insertTree:
      query.push(`
        INSERT INTO md2.tree
        (
          id,
          type,
          name,
          content,
          parent,
          seq,
          user
        )
        VALUES
        (?, ?, ?, ?, ?,
          (
            SELECT IFNULL(MAX(tr.seq), 0) + 1
            FROM md2.tree tr
            WHERE tr.user = ?
            AND tr.parent = ?
            AND tr.type = ? 
            AND tr.delete_yn = 'N'
          ),
          ?
        )                  
      `);
      queryParams.push(request.id);

      queryParams.push(request.type);
      queryParams.push(request.name);
      queryParams.push(request.content);
      queryParams.push(request.parent);

      queryParams.push(request.user);
      queryParams.push(request.parent);
      queryParams.push(request.type);

      queryParams.push(request.user);
      break;

    case TreeQueryId.updateTree:
      query.push(`
        UPDATE md2.tree
        SET
          name = ?,
          content = ?
        WHERE user = ?
        AND id = ?
      `);
      queryParams.push(request.name);
      queryParams.push(request.content);
      queryParams.push(request.user);
      queryParams.push(request.id);
      break;

    case TreeQueryId.deleteTree:
      query.push(`
        UPDATE md2.tree
        SET 
          delete_yn = 'Y'
          ,seq = 9999
          ,deleted_date = CURDATE()
        WHERE user = ?
        AND id IN (${request.ids})
      `);
      queryParams.push(request.user);
      break;

    case TreeQueryId.retrieveTree:
      query.push(`
        SELECT
          tr.id,
          tr.type,
          tr.name,
          tr.content,
          tr.parent,
          NULL AS children
        FROM md2.tree tr
        WHERE tr.user = ?
        AND tr.parent = ?
        AND tr.delete_yn = 'N'
      `);
      queryParams.push(request.user);
      queryParams.push(request.parent);

      query.push(`
        ORDER BY tr.type, tr.seq
      `);
      break;

    case TreeQueryId.retrieveDeleteTarget:
      query.push(`
        SELECT
          tr.id,
          tr.type,
          tr.name,
          tr.content,
          tr.parent
        FROM md2.tree tr
        WHERE tr.user = ?
        AND tr.parent = ?
        AND tr.delete_yn = 'N'
      `);
      queryParams.push(request.user);
      queryParams.push(request.id);
      break;
    
    case TreeQueryId.updateSeqSurroundingTree:
      query.push(`
        UPDATE md2.tree AS tr,
        (
          SELECT
            t1.seq AS givSeq
            ,t2.id AS surroundId
          FROM 
          (
            SELECT 
              RANK() OVER(ORDER BY t.seq) AS 'num'
              ,t.id
              ,t.seq
            FROM md2.tree t
            WHERE t.user = ?
            AND t.parent = ?
            AND t.type = ?
            ORDER BY seq 
          ) AS t1
          JOIN (
            SELECT 
              RANK() OVER(ORDER BY t.seq) AS 'num'
              ,t.id
            FROM md2.tree t
            WHERE t.user = ?
            AND t.parent = ?
            AND t.type = ?
            ORDER BY seq 
          ) AS t2
          ON t1.num = t2.num ${request.upDown === UpDown.UP? `+` : `-`} 1
          WHERE t1.id = ?	
        ) AS sq
        SET tr.seq = sq.givSeq
        WHERE tr.id = sq.surroundId
      `);
      queryParams.push(request.user);
      queryParams.push(request.parent);
      queryParams.push(request.type);
      queryParams.push(request.user);
      queryParams.push(request.parent);
      queryParams.push(request.type);
      queryParams.push(request.id);

      break;
    
    case TreeQueryId.updateSeqTargetTree:
      query.push(`
        UPDATE md2.tree 
        SET seq = seq ${request.upDown === UpDown.UP? `-` : `+`} 1
        WHERE user = ?
        AND id = ?
      `);
      queryParams.push(request.user);
      queryParams.push(request.id);
      break;
    
    case TreeQueryId.getTree:
      query.push(`
        SELECT
          tr.id,
          tr.type,
          tr.name,
          tr.content,
          tr.parent,
          NULL AS children
        FROM md2.tree tr
        WHERE tr.user = ?
        AND tr.id = ?
      `);
      queryParams.push(request.user);
      queryParams.push(request.id);
      break;
    
    case TreeQueryId.correctSeqTargetTree:
      query.push(`
        CALL md2.correctSeqTargetTree(?, ?);
      `);
      queryParams.push(request.user);
      queryParams.push(request.parent);
      break;
    
    case TreeQueryId.updateLocationTree:
      query.push(`
        UPDATE md2.tree t 
        SET 
          t.parent = ?
          ,t.seq = 99999999
        WHERE t.user = ?
        AND t.id IN (
      `);
      queryParams.push(request.parent);
      queryParams.push(request.user);

      request.ids && request.ids.forEach((id: number, index: number, ids: number[]) => {
        query.push(`?`);
        queryParams.push(id);
        if (ids.length !== index + 1) query.push(`,`);
      });
      query.push(`)`);
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