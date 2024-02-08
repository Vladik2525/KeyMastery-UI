import { IUser } from '../user/IUser'

export interface IText {
    id: number
    text: string[]
    userId: number
    user: IUser
    createdAt: Date
    updatedAt: Date
}