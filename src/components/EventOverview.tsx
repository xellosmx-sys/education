import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Sparkles,
  FileCheck,
  CheckCircle,
  Copy,
  ChevronRight,
  Laptop,
  Flame,
  Send,
} from 'lucide-react';
import { EVENT_INFO, TIMELINE_SCHEDULES } from '../data/mockData';

interface EventOverviewProps {
  onOpenApplyModal: () => void;
}

export const EventOverview: React.FC<EventOverviewProps> = ({ onOpenApplyModal }) => {
  const [copied, setCopied] = useState(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(null);

  const copyPromotionText = () => {
    const text = `[교육안내] ${EVENT_INFO.title}
■ 일시: ${EVENT_INFO.date} ${EVENT_INFO.time}
■ 장소: ${EVENT_INFO.location} (${EVENT_INFO.address})
■ 대상: ${EVENT_INFO.target}
■ 교육 특징:
1) ${EVENT_INFO.keyMessages[0].title} - ${EVENT_INFO.keyMessages[0].description}
2) ${EVENT_INFO.keyMessages[1].title} - ${EVENT_INFO.keyMessages[1].description}
3) ${EVENT_INFO.keyMessages[2].title} - ${EVENT_INFO.keyMessages[2].description}
■ 혜택: 교육비 전액 국비지원(무료), 상시학습 7시간 인정, 점심 오찬 및 무료주차 제공
■ 신청: 선착순 48명 마감`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <section id="section-overview" className="space-y-4">
      {/* Event Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl text-white p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              2026 공공부문 디지털 역량강화 과정
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Award className="w-3.5 h-3.5" />
              상시학습 7시간 인정
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Flame className="w-3.5 h-3.5" />
              정원 48명 선착순
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
            {EVENT_INFO.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed mb-6">
            공공기관 실무자가 생성형 AI를 활용하여 기안문 작성, 데이터 분석, 그리고 
            사내 업무지원 웹앱(ChatGPT Sites)을 직접 만들어 당일 현업에 즉시 적용하는 1일 집중 마스터 과정입니다.
          </p>

          {/* Quick Details Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">일시</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{EVENT_INFO.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/30 flex items-center justify-center text-indigo-300">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">교육 시간</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{EVENT_INFO.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-3">
              <div className="w-9 h-9 rounded-lg bg-purple-600/30 flex items-center justify-center text-purple-300">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">교육 장소</span>
                <span className="text-xs sm:text-sm font-semibold text-white truncate max-w-[170px]">
                  {EVENT_INFO.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xs border border-white/10 rounded-xl p-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/30 flex items-center justify-center text-emerald-300">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">교육 대상</span>
                <span className="text-xs sm:text-sm font-semibold text-white">공공기관 직원 48명</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-apply-btn"
              onClick={onOpenApplyModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>지금 수강 신청하기</span>
            </button>

            <button
              id="copy-promotion-btn"
              onClick={copyPromotionText}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-slate-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">홍보 문구 복사완료!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-300" />
                  <span>사내 게시용 안내문구 복사</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Core Messages Cards (3 Points) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>교육 핵심 메시지 및 차별화 강점</span>
          </h3>
          <span className="text-xs text-slate-500">실무 밀착형 3대 집중 전략</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {EVENT_INFO.keyMessages.map((msg, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {msg.tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">POINT 0{index + 1}</span>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  "{msg.title}"
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {msg.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-blue-700 font-medium">
                <span>자세히 보기</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Timeline Schedule */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>세부 일정 (요약 타임라인)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              오전 9시 30분부터 오후 5시 30분까지 진행되는 7단계 커리큘럼
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> 강의
            <span className="w-2 h-2 rounded-full bg-emerald-500 ml-2" /> 실습
            <span className="w-2 h-2 rounded-full bg-purple-500 ml-2" /> 워크숍
            <span className="w-2 h-2 rounded-full bg-slate-400 ml-2" /> 행정
          </div>
        </div>

        {/* Timeline list */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {TIMELINE_SCHEDULES.map((item, idx) => {
            const isSelected = selectedSessionIndex === idx;
            const badgeColors = {
              실습: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              강의: 'bg-blue-50 text-blue-700 border-blue-200',
              워크숍: 'bg-purple-50 text-purple-700 border-purple-200',
              행정: 'bg-slate-100 text-slate-700 border-slate-200',
            }[item.type];

            const dotColors = {
              실습: 'bg-emerald-500 ring-emerald-100',
              강의: 'bg-blue-500 ring-blue-100',
              워크숍: 'bg-purple-500 ring-purple-100',
              행정: 'bg-slate-400 ring-slate-100',
            }[item.type];

            return (
              <div
                key={idx}
                onClick={() => setSelectedSessionIndex(isSelected ? null : idx)}
                className={`relative group cursor-pointer p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-blue-50/40 border-blue-300 shadow-xs'
                    : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200'
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-[27px] sm:-left-[35px] top-4 w-3.5 h-3.5 rounded-full ring-4 ${dotColors}`}
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.time}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${badgeColors}`}>
                      {item.type}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  {item.instructor && (
                    <span className="text-xs text-slate-500 font-medium sm:text-right">
                      강사: {item.instructor}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
                  {item.description}
                </p>

                {/* Extended Details */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium">기대 산출물:</span>
                    <span className="text-slate-600">{item.outputs}</span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    <Laptop className="w-3.5 h-3.5 text-slate-400" />
                    {item.keyTools.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-white text-slate-600 border border-slate-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
