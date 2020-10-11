interface IInternalData {
  [key: string]: number | string;
}

class AppError {
  public readonly message: string;

  public readonly statusCode: number;

  public readonly data: IInternalData;

  constructor(message: string, data: IInternalData, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export default AppError;
