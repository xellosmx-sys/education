export type ApplicantStatus = '신청' | '대기' | '확정' | '취소';

export type FollowUpType = '전화' | '메일' | '문자';

export interface FollowUpLog {
  id: string;
  type: FollowUpType;
  date: string;
  notes: string;
  author: string;
}

export interface Applicant {
  id: string;
  registrationNumber: string;
  name: string;
  organization: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  status: ApplicantStatus;
  inquiry: string;
  assignee: string; // 담당자 (예: 김주무관, 이선임, 박책임)
  channel: string; // 유입 채널 (사내게시판, 이메일, 문자, 카카오, 홈페이지 등)
  registeredAt: string;
  followUps: FollowUpLog[];
}

export interface ChannelStat {
  id: string;
  channelName: string;
  iconName: string;
  impressions: number; // 노출
  clicks: number;      // 클릭
  applications: number;// 신청
  ctr: number;         // 클릭률 (%)
  cvr: number;         // 전환율 (%)
  targetAudience: string;
  status: '진행중' | '예정' | '완료';
}

export type ContentCategory = '공지' | '리마인드' | '커리큘럼 소개' | '강사 소개' | '후기' | 'FAQ';

export type ContentStatus = '배포완료' | '작성중' | '예정';

export interface CalendarPlan {
  id: string;
  dDay: string; // e.g. "D-30", "D-15", "D-1"
  date: string; // e.g. "2026-09-22"
  title: string;
  category: ContentCategory;
  channel: string;
  status: ContentStatus;
  assignee: string;
  keyMessage: string;
  metrics?: {
    views?: number;
    clicks?: number;
  };
}

export interface TimelineSchedule {
  time: string;
  title: string;
  instructor?: string;
  type: '강의' | '실습' | '워크숍' | '행정';
  description: string;
  outputs: string;
  keyTools: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
