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
  name_lowercase: 'technology',
  name_capitalize: 'Technology',
  name_uppercase: 'TECHNOLOGY',
  name_lowercase_plural: 'technologies',
  name_capitalize_plural: 'Technologies',
  name_uppercase_plural: 'TECHNOLOGIES'
}

export interface ITechnology {
  name: string
  id?: string
  deleted?: boolean
  createdOn?: string
  updatedOn?: string
  createdBy?: string
  updatedBy?: string
}

export const NewEmptyItem = {
  "id": "",
  "name": "",
  "endDate": "",
  "timings": "",
  "updatedBy": "",
  "demoDate": "",
  "durationInHours": null,
  "startDate": "",
};
