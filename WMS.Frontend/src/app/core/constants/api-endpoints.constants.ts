import { environment } from "src/environments/environment";

export class ApiEndpoints {
  public static readonly AuthLogin = `${ environment.apiBaseUrl }/Auth/Login`;
}