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
export enum MembershipPlan {
  None = "none",
  Personal = "personal",
  Starter = "starter",
  Master = "master",
  Premium = "premium",
}
export const membershipPlans: {
  plan: MembershipPlan;
  duration: number;
  price: number;
  icon: string;
  save?: number;
}[] = [
  {
    plan: MembershipPlan.Personal,
    duration: 1,
    price: 150_000,
    icon: "/star-medal.png",
  },
  {
    plan: MembershipPlan.Starter,
    duration: 3,
    price: 400_000,
    icon: "/gold-medal.png",
    save: 10,
  },
  {
    plan: MembershipPlan.Master,
    duration: 6,
    price: 700_000,
    icon: "/trophy-star-2.png",
    save: 28,
  },
  {
    plan: MembershipPlan.Premium,
    duration: 12,
    price: 1_200_000,
    icon: "/trophy-star.png",
    save: 50,
  },
];
