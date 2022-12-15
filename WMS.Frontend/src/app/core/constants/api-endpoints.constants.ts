import { environment } from "src/environments/environment";

export class ApiEndpoints {

  public static readonly AuthLogin = `${ environment.apiBaseUrl }/Auth/Login`;

  public static readonly AuthRefresh = `${ environment.apiBaseUrl }/Auth/Refresh`;

  public static readonly Users = `${ environment.apiBaseUrl }/Users/`;

  public static readonly Wares = `${ environment.apiBaseUrl }/Wares/`;

  public static readonly UnitOfMeasurements = `${ environment.apiBaseUrl }/UnitOfMeasurements/`;

  public static readonly LegalEntities = `${ environment.apiBaseUrl }/LegalEntities/`;

  public static readonly Areas = `${ environment.apiBaseUrl }/Areas/`;

  public static readonly VerticalSections = `${ environment.apiBaseUrl }/VerticalSections/`;
  
  public static readonly Racks = `${ environment.apiBaseUrl }/Racks/`;
  
  public static readonly Shelfs = `${ environment.apiBaseUrl }/Shelfs/`;

  public static readonly Problems = `${ environment.apiBaseUrl }/Problems/`;

  public static readonly Comments = `${ environment.apiBaseUrl }/Comments/`;
}