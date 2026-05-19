export interface IApiRes<T> {
    code: number;
    message: string | null;
    description: string | null;
    total_item: number;
    data: T | null;
    metadata: any | null;
}