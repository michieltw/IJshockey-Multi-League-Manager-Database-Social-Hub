export interface StickConfig {
  handedness: 'Left' | 'Right';
  carbon: '18K Carbon' | '12K Carbon' | 'Full Carbon';
  flex: 65 | 75 | 85 | 95;
  kickPoint: 'Low' | 'Mid' | 'High';
  curve: 'P92' | 'P28' | 'P88' | 'PM9' | 'P02' | 'P08' | 'P91A' | 'P14';
  grip: 'Grip Finish' | 'Matte Finish';
  length: 'Senior (60")' | 'Intermediate (57")' | 'Junior (52")';
  color: string;
}

export const INITIAL_CONFIG: StickConfig = {
  handedness: 'Left',
  carbon: '18K Carbon',
  flex: 85,
  kickPoint: 'Mid',
  curve: 'P92',
  grip: 'Grip Finish',
  length: 'Senior (60")',
  color: '#0f172a'
};
