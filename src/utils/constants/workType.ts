import type { WorkType } from '../../types';
import { colors } from '../../styles/colors';

export const WORK_TYPE_COLORS: Record<WorkType, string> = {
  Remote: colors.secondary[500],
  Hybrid: colors.accent[500],
  'On-site': colors.info.main,
};

export const WORK_TYPE_ICONS: Record<WorkType, string> = {
  Remote: '🏠',
  Hybrid: '🔀',
  'On-site': '🏢',
};
