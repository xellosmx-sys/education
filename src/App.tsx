import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { EventOverview } from './components/EventOverview';
import { ChannelPerformance } from './components/ChannelPerformance';
import { ContentCalendar } from './components/ContentCalendar';
import { LeadManagement } from './components/LeadManagement';
import { RegistrationModal } from './components/RegistrationModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import {
  INITIAL_APPLICANTS,
  INITIAL_CHANNELS,
  INITIAL_CALENDAR_PLANS,
  EVENT_INFO,
} from './data/mockData';
import { Applicant, ApplicantStatus, ChannelStat, CalendarPlan, FollowUpLog } from './types';
import { Send, RotateCcw, Check, Sparkles } from 'lucide-react';

export default function App() {
  // Local persistence keys
  const STORAGE_KEY_APPLICANTS = 'ai_edu_applicants_v1';
  const STORAGE_KEY_CHANNELS = 'ai_edu_channels_v1';
  const STORAGE_KEY_CALENDAR = 'ai_edu_calendar_v1';

  // State: Applicants
  const [applicants, setApplicants] = useState<Applicant[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPLICANTS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICANTS;
    } catch {
      return INITIAL_APPLICANTS;
    }
  });

  // State: Channels
  const [channels, setChannels] = useState<ChannelStat[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CHANNELS);
      return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
    } catch {
      return INITIAL_CHANNELS;
    }
  });

  // State: Calendar Plans
  const [calendarPlans, setCalendarPlans] = useState<CalendarPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CALENDAR);
      return saved ? JSON.parse(saved) : INITIAL_CALENDAR_PLANS;
    } catch {
      return INITIAL_CALENDAR_PLANS;
    }
  });

  // Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Active channel filter driven by channel table click
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('전체');

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPLICANTS, JSON.stringify(applicants));
    } catch (e) {
      console.error(e);
    }
  }, [applicants]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CHANNELS, JSON.stringify(channels));
    } catch (e) {
      console.error(e);
    }
  }, [channels]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CALENDAR, JSON.stringify(calendarPlans));
    } catch (e) {
      console.error(e);
    }
  }, [calendarPlans]);

  // Handler: Add new applicant from Registration Modal
  const handleAddNewApplicant = (
    data: Omit<Applicant, 'id' | 'registrationNumber' | 'registeredAt' | 'followUps'>
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newId = `app-${Date.now()}`;
    const nextNumber = String(applicants.length + 1).padStart(3, '0');
    const regNum = `AI-2026-${nextNumber}`;

    const newApp: Applicant = {
      ...data,
      id: newId,
      registrationNumber: regNum,
      registeredAt: formattedDate,
      followUps: [
        {
          id: `f-${Date.now()}`,
          type: '문자',
          date: formattedDate,
          notes: '온라인 신청서 접수 자동 완료 문자 발송 (접수번호: ' + regNum + ')',
          author: '시스템',
        },
      ],
    };

    setApplicants((prev) => [newApp, ...prev]);

    // Also increment channel applications count dynamically!
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.channelName === data.channel || data.channel.includes(ch.channelName.split(' ')[0])) {
          const newApps = ch.applications + 1;
          const newCvr = ch.clicks > 0 ? Number(((newApps / ch.clicks) * 100).toFixed(1)) : ch.cvr;
          return {
            ...ch,
            applications: newApps,
            cvr: newCvr,
          };
        }
        return ch;
      })
    );

    showToast(`신청이 완료되었습니다! (접수번호: ${regNum})`);
  };

  // Handler: Update Applicant status
  const handleUpdateApplicantStatus = (id: string, newStatus: ApplicantStatus) => {
    setApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    showToast(`신청자 상태가 '${newStatus}'(으)로 변경되었습니다.`);
  };

  // Handler: Add follow-up log to applicant
  const handleAddFollowUp = (applicantId: string, followUp: Omit<FollowUpLog, 'id'>) => {
    const newLog: FollowUpLog = {
      ...followUp,
      id: `fl-${Date.now()}`,
    };

    setApplicants((prev) =>
      prev.map((app) =>
        app.id === applicantId
          ? {
              ...app,
              followUps: [newLog, ...app.followUps],
            }
          : app
      )
    );
    showToast('후속 조치 기록이 저장되었습니다.');
  };

  // Handler: Toggle Calendar Plan Status
  const handleTogglePlanStatus = (id: string) => {
    setCalendarPlans((prev) =>
      prev.map((plan) => {
        if (plan.id === id) {
          const nextStatus = plan.status === '배포완료' ? '작성중' : '배포완료';
          return { ...plan, status: nextStatus };
        }
        return plan;
      })
    );
    showToast('콘텐츠 배포 상태가 변경되었습니다.');
  };

  // Handler: Add new plan
  const handleAddCalendarPlan = (newPlan: Omit<CalendarPlan, 'id'>) => {
    const plan: CalendarPlan = {
      ...newPlan,
      id: `cal-${Date.now()}`,
    };
    setCalendarPlans((prev) => [...prev, plan]);
    showToast('새 홍보 콘텐츠 계획이 캘린더에 추가되었습니다.');
  };

  // Reset to initial mock data
  const handleResetData = () => {
    if (window.confirm('모든 데이터를 초기 기본 데이터로 재설정하시겠습니까?')) {
      setApplicants(INITIAL_APPLICANTS);
      setChannels(INITIAL_CHANNELS);
      setCalendarPlans(INITIAL_CALENDAR_PLANS);
      localStorage.removeItem(STORAGE_KEY_APPLICANTS);
      localStorage.removeItem(STORAGE_KEY_CHANNELS);
      localStorage.removeItem(STORAGE_KEY_CALENDAR);
      showToast('초기 데이터로 재설정되었습니다.');
    }
  };

  // Jump to applicant section with specific channel filter
  const handleSelectChannelFilter = (channelName: string) => {
    setActiveChannelFilter(channelName);
    const elem = document.getElementById('section-applicants');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const validApplicantsCount = applicants.filter((a) => a.status !== '취소').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header & Sticky Navigation */}
      <Header
        onOpenApplyModal={() => setIsApplyModalOpen(true)}
        applicantCount={validApplicantsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Quick Tools & Info Bar */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>가온인재개발원 공공부문 스마트 행정 교육지원 시스템</span>
          </div>
          <button
            onClick={handleResetData}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 px-2 py-1 rounded transition-colors cursor-pointer"
            title="테스트 데이터를 초기값으로 재설정합니다."
          >
            <RotateCcw className="w-3 h-3" />
            <span>데이터 초기화</span>
          </button>
        </div>

        {/* 1. 상단 KPI 섹션 */}
        <KpiCards applicants={applicants} channels={channels} />

        {/* 2. 행사 개요 & 핵심 카피 & 세부 일정 타임라인 */}
        <EventOverview onOpenApplyModal={() => setIsApplyModalOpen(true)} />

        {/* 3. 홍보 채널 성과 (표 & 차트) */}
        <ChannelPerformance
          channels={channels}
          onSelectChannelFilter={handleSelectChannelFilter}
        />

        {/* 4. 콘텐츠 캘린더 (D-30 ~ D-1 플래너) */}
        <ContentCalendar
          plans={calendarPlans}
          onToggleStatus={handleTogglePlanStatus}
          onAddPlan={handleAddCalendarPlan}
        />

        {/* 5. 신청자/리드 관리 (이름, 소속기관, 연락처, 상태, 문의, 담당자, 후속조치) */}
        <LeadManagement
          applicants={applicants}
          onUpdateApplicantStatus={handleUpdateApplicantStatus}
          onAddFollowUp={handleAddFollowUp}
          onOpenAddModal={() => setIsApplyModalOpen(true)}
          activeChannelFilter={activeChannelFilter}
          onClearChannelFilter={() => setActiveChannelFilter('전체')}
        />

        {/* 6. FAQ / 행사 안내 (접었다 펼치는 아코디언) */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating CTA Button for quick access */}
      <aside aria-label="Quick Registration" className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-cta-apply-btn"
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ring-4 ring-blue-100"
        >
          <Send className="w-4 h-4" />
          <span>지금 신청하기 ({validApplicantsCount}/48명)</span>
        </button>
      </aside>

      {/* Registration Modal Form */}
      <RegistrationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitApplicant={handleAddNewApplicant}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-slate-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
