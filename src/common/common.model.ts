export interface Message {
  msId       : number;
  msContent  : string;
  msObject  ?: any;
}

export enum MethodType {
  CREATE = '생성',
  READ   = '조회',
  UPDATE = '수정',
  DELETE = '삭제',
  EXTRA  = '작업',
}

export enum ControllerType {
  COMMON = 'common',
  TREE = '트리',
  ISSUE = '이슈',
  ISSUS_CHECK = '이슈체크',
}

export interface TransactionResult {
  affectedRows: number;
  insertId: any;
  warningStatus: number;
  fieldCount?: any;
  info?: string;
  serverStatus?: number;
  changedRows?: number;
}

export interface QueryInfo {
  query: string;
  queryParams?: any[];
}