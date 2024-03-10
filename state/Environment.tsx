import { create } from "zustand";

type BuildType = 'DEV' | 'TEST' | 'PROD';

type EnvironmentStore = {
  buildType: BuildType;
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  buildType: process.env.EXPO_PUBLIC_BUILD_TYPE as BuildType,
}))