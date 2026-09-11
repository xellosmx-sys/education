import React from 'react';
import { Sparkles, Calendar, MapPin, Users, Send } from 'lucide-react';
import { EVENT_INFO } from '../data/mockData';

interface HeaderProps {
  onOpenApplyModal: () => void;
  applicantCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenApplyModal, applicantCount }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-600 text-white font-medium text-[11px]">
              정부·공공기관 특별과정
            </span>
            <span className="text-slate-300">
              가온인재개발원 2026 공공부문 디지털 역량강화 직무연수
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-[11px]">
            <span>상시학습 7시간 인정</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">교육비 전액 국비지원 (무료)</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-emerald-400 font-medium">실습 좌석 마감 임박</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100">
            <Sparkles className="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                AI Edu Promotion & Recruitment
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                운영 관리 모드
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {EVENT_INFO.title}
            </h1>
          </div>
        </div>

        {/* Quick Info & CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-4 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{EVENT_INFO.date}</span>
            </div>
            <div className="w-px h-3 bg-slate-300" />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate max-w-[140px]">{EVENT_INFO.location}</span>
            </div>
            <div className="w-px h-3 bg-slate-300" />
            <div className="flex items-center gap-1.5 font-medium text-slate-800">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>
                모집현황 <strong className="text-blue-700">{applicantCount}</strong> / {EVENT_INFO.targetCount}명
              </span>
            </div>
          </div>

          <button
            id="header-cta-apply-btn"
            onClick={onOpenApplyModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow active:scale-[0.99] whitespace-nowrap cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>지금 신청하기</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-bar */}
      <div className="border-t border-slate-100 bg-slate-50/70 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 py-1.5 text-xs font-medium text-slate-600 whitespace-nowrap">
          <a
            href="#section-kpi"
            className="px-2.5 py-1 rounded-md hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            📊 종합 KPI
          </a>
          <a
            href="#section-overview"
            className="px-2.5 py-1 rounded-md hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            🎯 행사 개요 및 타임라인
          </a>
          <a
            href="#section-channel"
            className="px-2.5 py-1 rounded-md hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            📢 홍보 채널 성과
          </a>
          <a
            href="#section-calendar"
            className="px-2.5 py-1 rounded-md hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            🗓️ 콘텐츠 캘린더 (D-30~D-1)
          </a>
          <a
            href="#section-applicants"
            className="px-2.5 py-1 rounded-md hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            👥 신청자/리드 관리
          </a>
          <a
            href="#section-faq"
            className="px-2.5 py-1 rounded-md hover:text-blue-700 hover:bg-blue-50 transition-colors"
          >
            ❓ FAQ 및 행사 안내
          </a>
        </div>
      </div>
    </header>
  );
};
