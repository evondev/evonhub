export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}
export enum UserPermission {
  CREATE_COURSE = "create:course",
  UPDATE_COURSE = "update:course",
  CREATE_LECTURE = "create:lecture",
  UPDATE_LECTURE = "update:lecture",
  DELETE_LECTURE = "delete:lecture",
  CREATE_LESSON = "create:lesson",
  UPDATE_LESSON = "update:lesson",
  DELETE_LESSON = "delete:lesson",
  CREATE_COMMENT = "create:comment",
  UPDATE_COMMENT = "update:comment",
  DELETE_COMMENT = "delete:comment",
  CREATE_CATEGORY = "create:category",
  UPDATE_CATEGORY = "update:category",
  DELETE_CATEGORY = "delete:category",
  CREATE_REACTION = "create:reaction",
}
export enum UserRole {
  Admin = "ADMIN",
  Expert = "EXPERT",
  User = "USER",
}
export enum UserPackage {
  None = "none",
  Month = "month",
  Quarter = "quarter",
  HalfYear = "half-year",
  Year = "year",
}
