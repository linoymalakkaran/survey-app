export class ApplicationTypesModel {
  Id: string;
  Name: string;
  IsActive: boolean;
  SecretKey: string;
  constructor(Id: string, Name: string, IsActive: boolean, SecretKey: string) {
    this.Id = Id;
    this.Name = Name;
    this.IsActive = IsActive;
    this.SecretKey = SecretKey;
  }
}
