import type { Internship } from '../types';

export type HomeStackParamList = {
  Home: undefined;
  InternshipDetail: { internship: Internship };
};

export type SearchStackParamList = {
  Search: undefined;
  InternshipDetail: { internship: Internship };
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

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};
