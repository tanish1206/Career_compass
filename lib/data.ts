// Main data module - Re-exports types and mock data
// This file maintains backward compatibility while using the new structure

// Export all types
export type {
  RoadmapNode,
  TestQuestion,
  Resource,
  PlacementOpening,
  NewsItem,
  UserProfile,
  RankingData,
} from './types';

// Export all mock data
export {
  frontendRoadmap,
  mockQuestions,
  resources,
  placementOpenings,
  newsItems,
  defaultUserProfile,
  rankingData,
} from './mockData';

// Export storage utilities
export {
  getUserProfile,
  saveUserProfile,
  clearUserProfile,
  getRoadmapProgress,
  saveRoadmapProgress,
  clearRoadmapProgress,
  getTestScores,
  saveTestScore,
  clearTestScores,
  clearAllData,
  hasCompletedOnboarding,
} from './storage';

export type { TestScore } from './storage';
