interface BlockInfo {
  blockId: string;
  content: string;
  index: number;
  type: string;
  createdAt: string;
}

interface PageInfo {
  title: string;
  nextId: string;
  pageId: string;
  blocks: BlockInfo[];
}

interface CreateBlockParam {
  prevBlockId?: string;
  index: number;
  content: string;
  type: string;
  notSaveOption?: boolean;
  callBack?: (page: PageInfo) => void;
}

interface ChangeBlockInfo {
  blockId: string;
  content?: string;
  index?: number;
  type?: string;
  createdAt?: string;
}

interface ChangeBlockParam {
  block: ChangeBlockInfo;
  notSaveOption?: boolean;
  callBack?: (page: PageInfo) => void;
}

interface DeleteBlockParam {
  blockId: string;
  notSaveOption?: boolean;
  callBack?: (page: PageInfo) => void;
}
