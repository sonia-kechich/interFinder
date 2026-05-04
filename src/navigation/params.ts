import type { Internship } from '../types';
import type { HomeStackParamList, SearchStackParamList } from './types';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  ApplicationsTab: undefined;
  ProfileTab: undefined;
};

export type { HomeStackParamList, SearchStackParamList };
