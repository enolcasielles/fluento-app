import { ApiError } from "@/types/api-error";

export interface ICustomError {
  type?: string;
  message?: string;
}

export class CustomError {
  type: string;
  message: string;

  constructor({
    type = 'UnexpectedError',
    message = 'Ha ocurrido un error inesperado',
  }: ICustomError) {
    this.type = type;
    this.message = message;
  }

  static fromApiError(json: ApiError): CustomError {
    return new CustomError({ message: json.message, type: json.type });
  }

  toJSON(): ICustomError {
    return {
      message: this.message,
    };
  }
}

export const buildCustomError = (error: CustomError): ICustomError => {
  return error.toJSON();
};
