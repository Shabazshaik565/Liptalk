import { Injectable } from '@nestjs/common';

export interface FeatureFlags {
  aiAssistant: boolean;
  liveRooms: boolean;
  creatorMode: boolean;
  enterpriseWorkspaces: boolean;
  trustVerification: boolean;
  marketplaceMonetization: boolean;
  realtimeVoiceVideo: boolean;
}

@Injectable()
export class FeatureFlagsService {
  private flags: FeatureFlags = {
    aiAssistant: true,
    liveRooms: true,
    creatorMode: true,
    enterpriseWorkspaces: true,
    trustVerification: true,
    marketplaceMonetization: true,
    realtimeVoiceVideo: true,
  };

  getFlags(): FeatureFlags {
    return { ...this.flags };
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags[flag] ?? false;
  }

  setFlag(flag: keyof FeatureFlags, value: boolean) {
    this.flags[flag] = value;
    return this.flags;
  }
}
