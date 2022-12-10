import { environment } from "src/environments/environment";

export class ApiEndpoints {

  public static readonly AuthLogin = `${ environment.apiBaseUrl }/Auth/Login`;

  public static readonly AuthRefresh = `${ environment.apiBaseUrl }/Auth/Refresh`;

  public static readonly Users = `${ environment.apiBaseUrl }/Users/`;
}