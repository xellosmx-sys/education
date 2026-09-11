import React from 'react';
import { ShieldCheck, Sparkles, Building2, Phone, Mail } from 'lucide-react';
import { EVENT_INFO } from '../data/mockData';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>가온인재개발원 공공부문 디지털혁신 교육센터</span>
            </div>
            <p className="text-slate-400 text-xs">
              {EVENT_INFO.title} 운영 관리 시스템 (AI Education Promotion & Recruitment Dashboard)
            </p>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>02-589-7241</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>ai-edu@gaon-hrd.go.kr</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            주소: 서울특별시 서초구 반포대로 140 가온인재개발원 3층 AI교육실 | 사업자등록번호: 214-82-09871
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">개인정보처리방침</span>
            <span>•</span>
            <span className="text-slate-400">이용약관</span>
            <span>•</span>
            <span>© 2026 Gaon Human Resources Development Institute. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
