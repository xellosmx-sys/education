import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Building,
  UserCheck,
  FileSpreadsheet,
  ChevronDown,
  History,
} from 'lucide-react';
import { Applicant, ApplicantStatus, FollowUpType, FollowUpLog } from '../types';

interface LeadManagementProps {
  applicants: Applicant[];
  onUpdateApplicantStatus: (id: string, newStatus: ApplicantStatus) => void;
  onAddFollowUp: (applicantId: string, followUp: Omit<FollowUpLog, 'id'>) => void;
  onOpenAddModal: () => void;
  activeChannelFilter?: string;
  onClearChannelFilter?: () => void;
}

export const LeadManagement: React.FC<LeadManagementProps> = ({
  applicants,
  onUpdateApplicantStatus,
  onAddFollowUp,
  onOpenAddModal,
  activeChannelFilter,
  onClearChannelFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [channelFilter, setChannelFilter] = useState(activeChannelFilter || '전체');
  const [statusFilter, setStatusFilter] = useState<'전체' | ApplicantStatus>('전체');
  const [assigneeFilter, setAssigneeFilter] = useState('전체');

  // Selected applicant for detailed drawer/modal
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  // Quick Follow-up modal state
  const [followUpApplicant, setFollowUpApplicant] = useState<Applicant | null>(null);
  const [followUpType, setFollowUpType] = useState<FollowUpType>('전화');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [followUpAuthor, setFollowUpAuthor] = useState('김주무관');

  // Sync if external filter provided
  React.useEffect(() => {
    if (activeChannelFilter) {
      setChannelFilter(activeChannelFilter);
    }
  }, [activeChannelFilter]);

  // Filtering
  const filteredApplicants = applicants.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      app.name.toLowerCase().includes(searchLower) ||
      app.organization.toLowerCase().includes(searchLower) ||
      app.department.toLowerCase().includes(searchLower) ||
      app.phone.includes(searchLower) ||
      app.email.toLowerCase().includes(searchLower);

    const matchesChannel =
      channelFilter === '전체' || app.channel.includes(channelFilter) || channelFilter.includes(app.channel);
    const matchesStatus = statusFilter === '전체' || app.status === statusFilter;
    const matchesAssignee = assigneeFilter === '전체' || app.assignee === assigneeFilter;

    return matchesSearch && matchesChannel && matchesStatus && matchesAssignee;
  });

  const getStatusBadge = (status: ApplicantStatus) => {
    switch (status) {
      case '확정':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '신청':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '대기':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '취소':
        return 'bg-slate-100 text-slate-500 border-slate-200 line-through';
    }
  };

  const handleFollowUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpApplicant || !followUpNotes.trim()) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    onAddFollowUp(followUpApplicant.id, {
      type: followUpType,
      date: formattedDate,
      notes: followUpNotes,
      author: followUpAuthor,
    });

    setFollowUpNotes('');
    setFollowUpApplicant(null);
  };

  const exportToExcel = () => {
    // Generate UTF-8 with BOM for Excel compatibility
    const headers = [
      '접수번호',
      '성명',
      '소속기관',
      '부서',
      '직급',
      '연락처',
      '이메일',
      '신청상태',
      '유입채널',
      '담당자',
      '접수일시',
      '문의내용',
      '후속조치이력',
    ];

    const rows = filteredApplicants.map((a) => {
      const followUpSummary = a.followUps.map((f) => `[${f.type}] ${f.date} (${f.author}): ${f.notes}`).join(' | ');
      return [
        a.registrationNumber,
        a.name,
        a.organization,
        a.department,
        a.position,
        a.phone,
        a.email,
        a.status,
        a.channel,
        a.assignee,
        a.registeredAt,
        `"${(a.inquiry || '').replace(/"/g, '""')}"`,
        `"${followUpSummary.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `공공기관_생성형AI교육_신청자리스트_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="section-applicants" className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>신청자 / 리드 관리 대장</span>
          </h3>
          <p className="text-xs text-slate-500">
            소속기관, 신청 상태(신청/대기/확정/취소), 문의 내용, 담당자 및 후속 조치(전화/메일/문자) 통합 관리
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="export-csv-btn"
            onClick={exportToExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>엑셀(CSV) 다운로드</span>
          </button>

          <button
            id="manual-add-applicant-btn"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>신청자 수동 추가</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="이름, 소속기관, 연락처 검색..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Channel Filter */}
          <div>
            <select
              value={channelFilter}
              onChange={(e) => {
                setChannelFilter(e.target.value);
                if (onClearChannelFilter && e.target.value === '전체') {
                  onClearChannelFilter();
                }
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="전체">모든 유입 채널</option>
              <option value="사내게시판">사내게시판 (인트라넷)</option>
              <option value="이메일">이메일 (뉴스레터/공문)</option>
              <option value="카카오">카카오 알림톡</option>
              <option value="문자">문자 (LMS/SMS)</option>
              <option value="홈페이지">홈페이지 배너/팝업</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="전체">모든 신청 상태</option>
              <option value="확정">확정 (교육 대상 확정)</option>
              <option value="신청">신청 (검토 대기)</option>
              <option value="대기">대기 (정원 초과 순번 대기)</option>
              <option value="취소">취소 (신청 취소)</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700"
            >
              <option value="전체">모든 담당자</option>
              <option value="김주무관">김주무관</option>
              <option value="이선임">이선임</option>
              <option value="박책임">박책임</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Info Pills */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-medium">검색 결과:</span>
            <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {filteredApplicants.length}명
            </span>
            {channelFilter !== '전체' && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                채널: {channelFilter}
                <button onClick={() => setChannelFilter('전체')} className="hover:text-red-500">×</button>
              </span>
            )}
            {statusFilter !== '전체' && (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                상태: {statusFilter}
                <button onClick={() => setStatusFilter('전체')} className="hover:text-red-500">×</button>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>상태 뱃지를 클릭하면 즉시 상태를 변경할 수 있습니다.</span>
          </div>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">접수번호</th>
                <th className="py-3 px-3">이름/직급</th>
                <th className="py-3 px-4">소속기관 / 부서</th>
                <th className="py-3 px-3">연락처 / 이메일</th>
                <th className="py-3 px-3 text-center">신청 상태 (클릭 변경)</th>
                <th className="py-3 px-3">유입 채널</th>
                <th className="py-3 px-3">담당자</th>
                <th className="py-3 px-4">문의 내용</th>
                <th className="py-3 px-3 text-center">후속 조치 (전화/메일/문자)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    조건에 맞는 신청자 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {app.registrationNumber}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        {app.name}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {app.position || '담당자'}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{app.organization}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate max-w-[150px]">
                        {app.department || '-'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px]">
                      <div className="text-slate-800">{app.phone}</div>
                      <div className="text-slate-400 text-[10px] truncate max-w-[140px]">{app.email}</div>
                    </td>

                    {/* Status Dropdown/Selector */}
                    <td className="py-3 px-3 text-center">
                      <select
                        value={app.status}
                        onChange={(e) => onUpdateApplicantStatus(app.id, e.target.value as ApplicantStatus)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-md border cursor-pointer focus:outline-none ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        <option value="신청">신청 (접수)</option>
                        <option value="확정">확정 (승인)</option>
                        <option value="대기">대기 (예비)</option>
                        <option value="취소">취소</option>
                      </select>
                    </td>

                    <td className="py-3 px-3 text-slate-700 whitespace-nowrap text-[11px]">
                      {app.channel}
                    </td>

                    <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                      {app.assignee}
                    </td>

                    <td className="py-3 px-4 max-w-[200px]">
                      {app.inquiry ? (
                        <p
                          className="text-[11px] text-slate-600 line-clamp-2 cursor-pointer hover:text-blue-700"
                          title={app.inquiry}
                          onClick={() => setSelectedApplicant(app)}
                        >
                          "{app.inquiry}"
                        </p>
                      ) : (
                        <span className="text-slate-400 text-[10px]">-</span>
                      )}
                    </td>

                    {/* Follow-up actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setFollowUpApplicant(app)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                          title="후속 조치 기록 추가"
                        >
                          <Plus className="w-3 h-3" />
                          <span>조치</span>
                        </button>

                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="px-2 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold transition-colors cursor-pointer"
                          title="이력 상세 보기"
                        >
                          이력 ({app.followUps.length})
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Quick Add Follow-Up Log */}
      {followUpApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>후속 조치 기록 등록</span>
                </h4>
                <p className="text-xs text-slate-500">
                  대상: <strong>{followUpApplicant.name}</strong> ({followUpApplicant.organization})
                </p>
              </div>
              <button
                onClick={() => setFollowUpApplicant(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFollowUpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">조치 유형</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['전화', '메일', '문자'] as FollowUpType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFollowUpType(t)}
                      className={`py-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        followUpType === t
                          ? 'bg-blue-50 text-blue-700 border-blue-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {t === '전화' && <Phone className="w-3.5 h-3.5" />}
                      {t === '메일' && <Mail className="w-3.5 h-3.5" />}
                      {t === '문자' && <MessageSquare className="w-3.5 h-3.5" />}
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">기록자 (담당자)</label>
                <select
                  value={followUpAuthor}
                  onChange={(e) => setFollowUpAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="김주무관">김주무관</option>
                  <option value="이선임">이선임</option>
                  <option value="박책임">박책임</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">후속 조치 내용 및 상담 메모</label>
                <textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  rows={3}
                  placeholder="예: 전화 통화 완료. 상시학습 7시간 인정 공문 안내 및 개인 노트북 지참 재확인."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFollowUpApplicant(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer"
                >
                  기록 저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Applicant Full Details & History Drawer */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-400">
                    {selectedApplicant.registrationNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(
                      selectedApplicant.status
                    )}`}
                  >
                    {selectedApplicant.status}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedApplicant.name} {selectedApplicant.position}
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedApplicant.organization} · {selectedApplicant.department}
                </p>
              </div>
              <button
                onClick={() => setSelectedApplicant(null)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 block">연락처</span>
                <span className="font-semibold text-slate-800">{selectedApplicant.phone}</span>
              </div>
              <div>
                <span className="text-slate-400 block">이메일</span>
                <span className="font-semibold text-slate-800">{selectedApplicant.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block">유입 채널</span>
                <span className="font-semibold text-slate-800">{selectedApplicant.channel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">담당 관리자</span>
                <span className="font-semibold text-slate-800">{selectedApplicant.assignee}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block">접수 일시</span>
                <span className="font-semibold text-slate-800">{selectedApplicant.registeredAt}</span>
              </div>
            </div>

            {/* Inquiries */}
            {selectedApplicant.inquiry && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">사전 문의 및 요청 사항</span>
                <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-950">
                  {selectedApplicant.inquiry}
                </div>
              </div>
            )}

            {/* Follow-up Timeline History */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-slate-500" />
                  <span>후속 조치 이력 로그 ({selectedApplicant.followUps.length}건)</span>
                </span>
                <button
                  onClick={() => {
                    setFollowUpApplicant(selectedApplicant);
                  }}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  + 새 조치 추가
                </button>
              </div>

              {selectedApplicant.followUps.length === 0 ? (
                <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-lg text-center">
                  등록된 후속 조치 이력이 없습니다.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedApplicant.followUps.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-800">
                          {log.type === '전화' && <Phone className="w-3 h-3 text-blue-600" />}
                          {log.type === '메일' && <Mail className="w-3 h-3 text-indigo-600" />}
                          {log.type === '문자' && <MessageSquare className="w-3 h-3 text-emerald-600" />}
                          <span>[{log.type}]</span>
                          <span className="font-normal text-slate-500">작성자: {log.author}</span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">{log.date}</span>
                      </div>
                      <p className="text-slate-700">{log.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedApplicant(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-white text-xs font-semibold hover:bg-slate-900 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
