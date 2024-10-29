
export interface RequestType extends Request {
    user: { _id: number; email: string; }
}