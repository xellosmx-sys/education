import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Phone,
  Mail,
  HelpCircle,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Applicant } from '../types';
import { EVENT_INFO } from '../data/mockData';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitApplicant: (newApplicant: Omit<Applicant, 'id' | 'registrationNumber' | 'registeredAt' | 'followUps'>) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmitApplicant,
}) => {
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [channel, setChannel] = useState('사내게시판 (인트라넷)');
  const [inquiry, setInquiry] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(true);

  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Required field validation
    if (!name.trim() || !organization.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage('필수 항목(이름, 소속, 연락처, 이메일)을 모두 입력해 주세요.');
      return;
    }

    if (!privacyAgreed) {
      setErrorMessage('개인정보 수집 및 이용에 동의해 주셔야 신청이 가능합니다.');
      return;
    }

    // Call submit handler
    onSubmitApplicant({
      name: name.trim(),
      organization: organization.trim(),
      department: department.trim() || '소속부서',
      position: position.trim() || '직원',
      phone: phone.trim(),
      email: email.trim(),
      status: '신청',
      inquiry: inquiry.trim(),
      assignee: '김주무관',
      channel: channel,
    });

    // Generate random confirmation number
    const regNum = `AI-2026-${Math.floor(100 + Math.random() * 900)}`;
    setSubmittedNumber(regNum);

    // Confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const handleClose = () => {
    setSubmittedNumber(null);
    setName('');
    setOrganization('');
    setDepartment('');
    setPosition('');
    setPhone('');
    setEmail('');
    setInquiry('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-xl cursor-pointer p-1"
        >
          ✕
        </button>

        {submittedNumber ? (
          /* Submission Success State */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                접수 완료
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 pt-1">
                신청이 접수되었습니다!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                입력하신 연락처와 이메일로 교육 참여 안내문 및 사전 설문 링크가 발송되었습니다.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">접수 번호</span>
                <span className="font-mono font-bold text-blue-700 text-sm">{submittedNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">신청자 성명</span>
                <span className="font-semibold text-slate-800">{name} ({position || '직원'})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">소속 기관</span>
                <span className="font-semibold text-slate-800">{organization}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">교육 일시</span>
                <span className="font-semibold text-slate-800">{EVENT_INFO.date} {EVENT_INFO.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">교육 장소</span>
                <span className="font-semibold text-slate-800">{EVENT_INFO.location}</span>
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-left text-[11px] text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1 text-blue-800">
                <Sparkles className="w-3.5 h-3.5" />
                <span>참석 확정 안내</span>
              </div>
              <p className="text-slate-600">
                선착순 48명 정원 심사 후 10월 15일 이내에 담당 관리자(가온인재개발원)가 개별 승인 확정 문자를 발송해 드립니다.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              확인 및 대시보드로 돌아가기
            </button>
          </div>
        ) : (
          /* Application Input Form */
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  교육 수강 신청
                </span>
                <span className="text-xs text-slate-400">선착순 48명</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {EVENT_INFO.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                아래 필수 정보를 입력하시면 신청 대장에 실시간으로 등록됩니다.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Row 1: Name and Organization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    신청자 이름 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    소속 기관명 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="예: 한국지능정보사회진흥원"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Department and Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    소속 부서
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="예: 디지털혁신팀"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    직급 / 직책
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="예: 선임연구원 / 주무관"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Row 3: Phone and Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    휴대전화 번호 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    이메일 주소 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@organization.or.kr"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Channel Source */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  유입 경로 (어디서 소식을 접하셨나요?)
                </label>
                <select
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="사내게시판 (인트라넷)">사내게시판 (인트라넷)</option>
                  <option value="이메일 (뉴스레터/공문)">이메일 (뉴스레터/공문)</option>
                  <option value="카카오 알림톡">카카오 알림톡</option>
                  <option value="문자 (LMS/SMS)">문자 (LMS/SMS)</option>
                  <option value="홈페이지 배너/팝업">홈페이지 배너/팝업</option>
                </select>
              </div>

              {/* Row 5: Inquiries / Requests */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  사전 문의사항 및 요청 내용 (선택)
                </label>
                <textarea
                  value={inquiry}
                  onChange={(e) => setInquiry(e.target.value)}
                  rows={2}
                  placeholder="예: 공공데이터 분석 실습 시 사용할 도구, 주차 지원 여부 등"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Privacy Policy Agreement */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyAgreed}
                    onChange={(e) => setPrivacyAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-600 leading-tight">
                    <strong>[필수] 개인정보 수집 및 이용 동의</strong>: 교육 운영, 출석 확인, 상시학습 수료증 발급 및 안내 문자 발송을 위해 이름, 연락처, 소속기관을 수집하며, 교육 종료 1년 후 파기됩니다.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="submit-registration-form-btn"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>교육 참가 신청서 제출하기</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
