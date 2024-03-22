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
    username: string;
    password: string;
    name: string;
    email?: string;
    address?: string;
    mobile?: string;
    profile_url?: string;
    token: string;
}

export interface IUserPayload {
    uid: number;
    username: string;
    name: string;
}
