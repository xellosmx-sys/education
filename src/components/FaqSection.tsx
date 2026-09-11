import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  Laptop,
  Phone,
  Mail,
  Navigation,
  Car,
  CheckCircle,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';
import { INITIAL_FAQS, EVENT_INFO } from '../data/mockData';

export const FaqSection: React.FC = () => {
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['faq-1', 'faq-2']);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setOpenFaqIds(INITIAL_FAQS.map((f) => f.id));
  };

  const collapseAll = () => {
    setOpenFaqIds([]);
  };

  return (
    <section id="section-faq" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>자주 묻는 질문 (FAQ) 및 교육 참여 안내</span>
          </h3>
          <p className="text-xs text-slate-500">
            교육 대상, 노트북 지참 여부, 주차 및 오시는 길, 상시학습 7시간 수료증, 운영 문의처
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={expandAll}
            className="text-slate-600 hover:text-blue-700 font-medium px-2 py-1 rounded bg-white border border-slate-200 cursor-pointer"
          >
            모두 펼치기
          </button>
          <button
            onClick={collapseAll}
            className="text-slate-600 hover:text-blue-700 font-medium px-2 py-1 rounded bg-white border border-slate-200 cursor-pointer"
          >
            모두 접기
          </button>
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5">
        {INITIAL_FAQS.map((faq) => {
          const isOpen = openFaqIds.includes(faq.id);

          return (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                className="w-full text-left p-4 sm:p-4.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <div className="flex items-start sm:items-center gap-2.5 flex-1">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    Q
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-blue-600">
                      [{faq.category}]
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h4>
                  </div>
                </div>

                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-4.5 sm:pb-4.5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      A
                    </span>
                    <p className="flex-1 text-slate-700">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Highlights Grid: Venue, Laptop, and Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
        {/* Card 1: Laptop & Equipment Check */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <span>준비물 및 장비 안내</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            개인/업무용 노트북 지참 필수 (전원 어댑터 지참 권장). 전 좌석 멀티탭 2구 및 초고속 기가비트 Wi-Fi 제공. Google Chrome 최신 브라우저 설치 권장.
          </p>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-blue-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>실습용 AI API 라이선스 무료 제공</span>
          </div>
        </div>

        {/* Card 2: Venue & Parking Guide */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <span>장소 및 주차 지원</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>가온인재개발원 3층 AI교육실</strong> (서초역 4번 출구 도보 5분). 자가용 이용 교육생 전원에게 <strong>전일 무료 주차권</strong>을 지급합니다.
          </p>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-indigo-700 font-medium flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-indigo-600" />
            <span>지하 2층~4층 자주식 주차 250대 가능</span>
          </div>
        </div>

        {/* Card 3: Contact & Desk */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </div>
            <span>운영 사무국 문의처</span>
          </div>
          <div className="text-xs text-slate-600 space-y-1">
            <div>
              <span className="text-slate-400">전화: </span>
              <strong className="text-slate-800">02-589-7241</strong>
            </div>
            <div>
              <span className="text-slate-400">이메일: </span>
              <strong className="text-slate-800">ai-edu@gaon-hrd.go.kr</strong>
            </div>
            <div className="text-[11px] text-slate-500">운영시간: 평일 09:00 ~ 18:00</div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>실시간 접수 문의 및 공문 발송 즉시 지원</span>
          </div>
        </div>
      </div>
    </section>
  );
};
