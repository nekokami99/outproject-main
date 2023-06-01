export interface AuthRequestInterface extends Request {
    tokenInfo: {
        _id: string
    }
}