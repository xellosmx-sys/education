import React from 'react';
import { Calendar, Users, Armchair, TrendingUp, HelpCircle, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { EVENT_INFO } from '../data/mockData';
import { Applicant, ChannelStat } from '../types';

interface KpiCardsProps {
  applicants: Applicant[];
  channels: ChannelStat[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ applicants, channels }) => {
  // 1. Calculate D-Day from current mock reference date (2026-09-10) to 2026-10-22
  const eventDate = new Date('2026-10-22T09:30:00');
  const today = new Date('2026-09-10T17:42:00'); // current mock timestamp
  const diffTime = eventDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 2. Applications vs Target
  const targetCount = EVENT_INFO.targetCount; // 48
  const validApplicants = applicants.filter((a) => a.status !== '취소');
  const totalApplied = validApplicants.length;
  const confirmedCount = applicants.filter((a) => a.status === '확정').length;
  const progressPercent = Math.min(100, Math.round((totalApplied / targetCount) * 100));

  // 3. Remaining seats
  const remainingSeats = Math.max(0, targetCount - totalApplied);

  // 4. Conversion Rate (Clicks -> Applications)
  const totalClicks = channels.reduce((acc, c) => acc + c.clicks, 0);
  const totalApplicationsFromChannels = channels.reduce((acc, c) => acc + c.applications, 0);
  const conversionRate = totalClicks > 0 ? ((totalApplicationsFromChannels / totalClicks) * 100).toFixed(1) : '0.0';

  // 5. Inquiries count
  const inquiriesWithText = applicants.filter((a) => a.inquiry && a.inquiry.trim().length > 0);
  const totalInquiries = inquiriesWithText.length;
  const pendingFollowUps = applicants.filter((a) => a.status === '신청' || a.status === '대기').length;

  return (
    <section id="section-kpi" className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>실시간 홍보·모집 핵심 지표 (KPI)</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              실시간 자동 집계중
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            목표 인원 48명 달성을 위한 다채널 유입 및 신청 현황 종합 대시보드
          </p>
        </div>
        <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto shadow-2xs">
          기준일시: <strong className="text-slate-800">2026.09.10 17:42</strong> (행사일 10.22 목)
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: D-Day */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">행사 D-Day</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-blue-700 tracking-tight">
              D-{diffDays}
            </span>
            <span className="text-xs text-slate-500">일 남음</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>개최일자</span>
            <span className="font-semibold text-slate-700">10.22(목) 09:30</span>
          </div>
        </div>

        {/* KPI 2: Target vs Applied */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">신청 인원 / 목표</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalApplied}
            </span>
            <span className="text-sm font-medium text-slate-500">/ {targetCount}명</span>
            <span className="ml-auto text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {progressPercent}%
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500">
            <span>확정 인원</span>
            <span className="font-semibold text-indigo-700">{confirmedCount}명 승인</span>
          </div>
        </div>

        {/* KPI 3: Remaining Seats */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">잔여 좌석</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Armchair className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${remainingSeats <= 10 ? 'text-amber-600' : 'text-slate-900'}`}>
              {remainingSeats}
            </span>
            <span className="text-xs text-slate-500">석 남음</span>
            {remainingSeats <= 10 && (
              <span className="ml-auto text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded animate-pulse">
                마감임박
              </span>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>정원 기준</span>
            <span className="font-semibold text-slate-700">총 48석 한정</span>
          </div>
        </div>

        {/* KPI 4: Conversion Rate */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">신청 전환율 (CVR)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tracking-tight">
              {conversionRate}%
            </span>
            <span className="ml-auto flex items-center text-xs font-bold text-emerald-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +1.2%p
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>클릭 대비 전환</span>
            <span className="font-semibold text-slate-700">
              {totalClicks}클릭 → {totalApplicationsFromChannels}명
            </span>
          </div>
        </div>

        {/* KPI 5: Inquiries Count */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold text-slate-600">문의 / 상담 건수</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-700 tracking-tight">
              {totalInquiries}
            </span>
            <span className="text-xs text-slate-500">건 등록</span>
            <span className="ml-auto text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              후속대기 {pendingFollowUps}
            </span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>주요 문의</span>
            <span className="font-semibold text-slate-700 truncate max-w-[100px]">
              보안규정·상시학습
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
