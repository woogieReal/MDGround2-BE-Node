export interface Tree {
  id       ?:number;
  type     ?:number;            // 10: folder, 20: file
  name     ?:string;
  content  ?:string;
  parent   ?:number;
  user     ?:string;
}

export interface RetrieveReq {
  parent: number;
  user: string;
}

export interface RetrieveRes {
  id: number;
  type: number;            // 10: folder, 20: file
  name: string;
  content: string;
  parent: number;
  user: string;
}

export interface GetNextTreeIdReq {
  user: string;
}

export interface GetNextTreeIdRes {
  nextTreeId: number;
}

export interface CreateReq {
  id: number;
  type: number;            // 10: folder, 20: file
  name: string;
  content: string;
  parent: number;
  user: string;
}

export interface UpdateReq {
  id: number;
  name: string;
  content: string;
  user: string;
}

export interface RetrieveDeleteTargetReq {
  id: number;
  user: string;
}

export interface DeleteReq {
  id: number;
  type: number;            // 10: folder, 20: file
  user: string;
}

export interface DeleteMultipleReq {
  ids: string;
  user: string;
}

export interface UpdateSeqReq {
  id: number;
  type: number;            // 10: folder, 20: file
  parent: number;
  upDown: UpDown;
  user: string;
}

export interface GetReq {
  id: number;
  user: string;
}

export interface CorrectSeqReq {
  parent: number;
  user: string;
}

export interface UpdateLocationReq {
  parent: number;
  ids: number[];
  user: string;
}

export enum Type {
  FORDER = 10,
  FILE = 20,
}

export enum UpDown {
  UP = 'UP',
  DOWN = 'DOWN',
}