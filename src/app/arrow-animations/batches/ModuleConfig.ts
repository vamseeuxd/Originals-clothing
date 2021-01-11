/*export interface IStudent {
  name: string
  id?: string
  email: string
  phone: string
  deleted?: boolean
  createdOn?: string
  updatedOn?: string
  createdBy?: string
  updatedBy?: string
}*/

export const ModuleConfig = {
  name_lowercase: 'batch',
  name_capitalize: 'Batch',
  name_uppercase: 'BATCH',
  name_lowercase_plural: 'batches',
  name_capitalize_plural: 'Batches',
  name_uppercase_plural: 'BATCHES'
}

export interface IBatch {
  name: string
  startDate: string
  sunDay?: boolean
  monDay?: boolean
  tuesDay?: boolean
  wenDay?: boolean
  thuDay?: boolean
  friDay?: boolean
  satDay?: boolean
  time: string
  fees: number
  id?: string
  deleted?: boolean
  createdOn?: string
  updatedOn?: string
  createdBy?: string
  updatedBy?: string
}

export interface IBatchTechnology {
  technologyId: string
  batchId: string
  id?: string
  deleted?: boolean
  createdOn?: string
  updatedOn?: string
  createdBy?: string
  updatedBy?: string
}

export interface IBatchStudent {
  studentId: string
  batchId: string
  id?: string
  deleted?: boolean
  createdOn?: string
  updatedOn?: string
  createdBy?: string
  updatedBy?: string
}

export const NewEmptyItem: IBatch = {
  "id": "",
  "name": "",
  "time": "",
  "startDate": "",
  "sunDay": false,
  "monDay": false,
  "tuesDay": false,
  "wenDay": false,
  "thuDay": false,
  "friDay": false,
  "satDay": false,
  "fees": 0,
};
