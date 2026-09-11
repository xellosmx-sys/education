import React, { useState } from 'react';
import {
  CalendarDays,
  ListFilter,
  CheckCircle2,
  Clock,
  Plus,
  Tag,
  User,
  ExternalLink,
  Layers,
  Sparkles,
  Eye,
  MousePointer,
} from 'lucide-react';
import { CalendarPlan, ContentCategory, ContentStatus } from '../types';

interface ContentCalendarProps {
  plans: CalendarPlan[];
  onToggleStatus: (id: string) => void;
  onAddPlan: (newPlan: Omit<CalendarPlan, 'id'>) => void;
}

const CATEGORIES: ('전체' | ContentCategory)[] = [
  '전체',
  '공지',
  '리마인드',
  '커리큘럼 소개',
  '강사 소개',
  '후기',
  'FAQ',
];

export const ContentCalendar: React.FC<ContentCalendarProps> = ({
  plans,
  onToggleStatus,
  onAddPlan,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'전체' | ContentCategory>('전체');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Plan State
  const [newDDay, setNewDDay] = useState('D-5');
  const [newDate, setNewDate] = useState('2026-10-17');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ContentCategory>('리마인드');
  const [newChannel, setNewChannel] = useState('카카오 알림톡');
  const [newAssignee, setNewAssignee] = useState('김주무관');
  const [newKeyMessage, setNewKeyMessage] = useState('');

  const filteredPlans = plans.filter((plan) => {
    const categoryMatch = selectedCategory === '전체' || plan.category === selectedCategory;
    const statusMatch = selectedStatus === '전체' || plan.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddPlan({
      dDay: newDDay,
      date: newDate,
      title: newTitle,
      category: newCategory,
      channel: newChannel,
      status: '작성중',
      assignee: newAssignee,
      keyMessage: newKeyMessage || newTitle,
      metrics: { views: 0, clicks: 0 },
    });

    setNewTitle('');
    setNewKeyMessage('');
    setShowAddModal(false);
  };

  const getCategoryBadgeClass = (category: ContentCategory) => {
    switch (category) {
      case '공지':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '리마인드':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '커리큘럼 소개':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '강사 소개':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '후기':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'FAQ':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadgeClass = (status: ContentStatus) => {
    switch (status) {
      case '배포완료':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '작성중':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '예정':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <section id="section-calendar" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <span>홍보 콘텐츠 캘린더 (D-30 ~ D-1 플래너)</span>
          </h3>
          <p className="text-xs text-slate-500">
            공지, 리마인드, 커리큘럼, 강사진 소개, 후기, FAQ 등 일자별 배포 계획 관리
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 text-xs">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              목록 타임라인
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              D-Day 카드뷰
            </button>
          </div>

          <button
            id="add-content-plan-btn"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>게시 계획 추가</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 shrink-0">유형 필터:</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500">진행 상태:</span>
          {['전체', '배포완료', '작성중', '예정'].map((st) => (
            <label key={st} className="inline-flex items-center gap-1 cursor-pointer text-slate-600">
              <input
                type="radio"
                name="statusFilter"
                checked={selectedStatus === st}
                onChange={() => setSelectedStatus(st)}
                className="text-blue-600 focus:ring-blue-500 text-xs"
              />
              <span>{st}</span>
            </label>
          ))}
          <span className="ml-auto text-slate-400">
            총 {filteredPlans.length}건 표시중
          </span>
        </div>
      </div>

      {/* Content View: Timeline Mode */}
      {viewMode === 'timeline' ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">D-Day</th>
                  <th className="py-3 px-3">예정 일자</th>
                  <th className="py-3 px-3">카테고리</th>
                  <th className="py-3 px-4">게시 제목 및 핵심 메시지</th>
                  <th className="py-3 px-3">배포 채널</th>
                  <th className="py-3 px-3">담당자</th>
                  <th className="py-3 px-3 text-center">배포 성과</th>
                  <th className="py-3 px-3 text-center">상태 관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {plan.dDay}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {plan.date}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getCategoryBadgeClass(
                          plan.category
                        )}`}
                      >
                        {plan.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                        {plan.title}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        "{plan.keyMessage}"
                      </p>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-700 font-medium">
                      {plan.channel}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        <User className="w-3 h-3 text-slate-500" />
                        {plan.assignee}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {plan.metrics && plan.metrics.views ? (
                        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                          <span className="flex items-center gap-0.5">
                            <Eye className="w-3 h-3 text-slate-400" /> {plan.metrics.views}
                          </span>
                          <span className="flex items-center gap-0.5 text-blue-600 font-medium">
                            <MousePointer className="w-3 h-3" /> {plan.metrics.clicks}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onToggleStatus(plan.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition-all cursor-pointer ${getStatusBadgeClass(
                          plan.status
                        )}`}
                        title="클릭하여 상태 변경 (배포완료 ↔ 작성중)"
                      >
                        {plan.status === '배포완료' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {plan.status === '작성중' && <Clock className="w-3 h-3 text-amber-600" />}
                        <span>{plan.status}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode (D-Day Cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                    {plan.dDay}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStatusBadgeClass(
                      plan.status
                    )}`}
                  >
                    {plan.status}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${getCategoryBadgeClass(
                      plan.category
                    )}`}
                  >
                    {plan.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{plan.date}</span>
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug mb-2">
                  {plan.title}
                </h4>

                <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 line-clamp-2 mb-3">
                  "{plan.keyMessage}"
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="truncate max-w-[110px]">{plan.channel}</span>
                <span className="font-medium text-slate-700">{plan.assignee}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Add New Content Plan */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>새 홍보 콘텐츠 계획 등록</span>
              </h4>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">D-Day 구분</label>
                  <input
                    type="text"
                    value={newDDay}
                    onChange={(e) => setNewDDay(e.target.value)}
                    placeholder="예: D-5"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">게시 예정일</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">콘텐츠 카테고리</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ContentCategory)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="공지">공지</option>
                  <option value="리마인드">리마인드</option>
                  <option value="커리큘럼 소개">커리큘럼 소개</option>
                  <option value="강사 소개">강사 소개</option>
                  <option value="후기">후기</option>
                  <option value="FAQ">FAQ</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">게시물 제목</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="예: [D-5] 교육 좌석 잔여 5석 긴급 안내"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">핵심 메시지/카피</label>
                <textarea
                  value={newKeyMessage}
                  onChange={(e) => setNewKeyMessage(e.target.value)}
                  placeholder="강조할 홍보 카피 또는 게시 요약"
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">배포 채널</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="사내게시판 (인트라넷)">사내게시판 (인트라넷)</option>
                    <option value="이메일 (뉴스레터/공문)">이메일 (뉴스레터/공문)</option>
                    <option value="카카오 알림톡">카카오 알림톡</option>
                    <option value="문자 (LMS/SMS)">문자 (LMS/SMS)</option>
                    <option value="홈페이지 배너/팝업">홈페이지 배너/팝업</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">담당자</label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="김주무관">김주무관</option>
                    <option value="이선임">이선임</option>
                    <option value="박책임">박책임</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-2xs"
                >
                  캘린더에 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
