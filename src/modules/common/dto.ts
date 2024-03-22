export class ResponseDto<T> {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly path?: string;
  public readonly results?: T[];
  public readonly result?: T;

  constructor(statusCode: number, message: string, path?: string, results?: T[], result?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.path = path;
    this.results = results;
    this.result = result;
  }
}
