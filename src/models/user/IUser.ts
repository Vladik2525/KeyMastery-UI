import { IText } from '../text/IText'

export interface IUser {
    id: number
    username: string
    email: string
    password: string
    createdAt: Date
    updatedAt: Date
    currentText: IText[]
}