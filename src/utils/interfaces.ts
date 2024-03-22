export interface ITelegramUser {
    uid: string;
    username: string;
    fname: string;
    lname?: string;
    lang: string;
    mobile?: string;
    bio?: string;
}

export interface IUser {
    id?: number;
    username: string;
    password: string;
    name: string;
    email?: string;
    address?: string;
    mobile?: string;
    profile_url?: string;
    token: string;
}
export interface IItem {
    title: string;
    caption: string;
    stock: boolean;
    price: string;
}

export interface IUserPayload {
    username: string;
    name: string;
}
