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
  name_lowercase: 'student',
  name_capitalize: 'Student',
  name_uppercase: 'STUDENT',
  name_lowercase_plural: 'students',
  name_capitalize_plural: 'Students',
  name_uppercase_plural: 'STUDENTS'
}

export interface IStudent {
  name: string
  mobile: string
  email: string
  id?: string
  deleted?: boolean
  createdOn?: string
  updatedOn?: string
  createdBy?: string
  updatedBy?: string
}

export const NewEmptyItem: IStudent = {
  "name": "",
  "mobile": "",
  "email": "",
};
