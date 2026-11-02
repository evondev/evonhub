export interface ApiModule {
  name: string;
  milestoneNumber: number;
}

export interface ApiModuleStatus extends ApiModule {
  isEnabled: boolean;
}
