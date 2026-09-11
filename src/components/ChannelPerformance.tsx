import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  MousePointerClick,
  Eye,
  UserCheck,
  ArrowUpDown,
  Mail,
  Layout,
  MessageSquare,
  PhoneCall,
  Globe,
  Info,
} from 'lucide-react';
import { ChannelStat } from '../types';

interface ChannelPerformanceProps {
  channels: ChannelStat[];
  onSelectChannelFilter?: (channelName: string) => void;
}

export const ChannelPerformance: React.FC<ChannelPerformanceProps> = ({
  channels,
  onSelectChannelFilter,
}) => {
  const [sortField, setSortField] = useState<'applications' | 'clicks' | 'impressions' | 'cvr'>(
    'applications'
  );
  const [sortAsc, setSortAsc] = useState(false);

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-4 h-4 text-blue-600" />;
      case 'Mail':
        return <Mail className="w-4 h-4 text-indigo-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4 text-amber-600" />;
      case 'PhoneCall':
        return <PhoneCall className="w-4 h-4 text-emerald-600" />;
      case 'Globe':
      default:
        return <Globe className="w-4 h-4 text-slate-600" />;
    }
  };

  const totalImpressions = channels.reduce((acc, c) => acc + c.impressions, 0);
  const totalClicks = channels.reduce((acc, c) => acc + c.clicks, 0);
  const totalApplications = channels.reduce((acc, c) => acc + c.applications, 0);
  const avgCtr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(1) : '0';
  const avgCvr = totalClicks > 0 ? ((totalApplications / totalClicks) * 100).toFixed(1) : '0';

  const maxApplications = Math.max(...channels.map((c) => c.applications), 1);

  // Sorting
  const sortedChannels = [...channels].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field: 'applications' | 'clicks' | 'impressions' | 'cvr') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <section id="section-channel" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>홍보 채널 성과 분석 (표 & 차트)</span>
          </h3>
          <p className="text-xs text-slate-500">
            사내게시판, 이메일, 문자, 카카오, 홈페이지 등 채널별 노출·클릭·신청 전환 지표
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            총 유입 신청 <strong className="text-blue-700">{totalApplications}명</strong> 집계
          </span>
        </div>
      </div>

      {/* Aggregate Funnel Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>총 노출수 (Impressions)</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {totalImpressions.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">회</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs">
            <MousePointerClick className="w-3.5 h-3.5 text-indigo-600" />
            <span>총 클릭수 (Clicks)</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            {totalClicks.toLocaleString()}
            <span className="text-xs font-normal text-slate-500 ml-1">클릭</span>
          </div>
          <span className="text-[11px] text-indigo-600 font-medium">평균 CTR {avgCtr}%</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>최종 신청자 (Applications)</span>
          </div>
          <div className="text-xl font-extrabold text-emerald-700">
            {totalApplications}
            <span className="text-xs font-normal text-slate-500 ml-1">명 접수</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">평균 CVR {avgCvr}%</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 mb-1 text-xs">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
            <span>최고 전환 채널</span>
          </div>
          <div className="text-base font-bold text-slate-900 truncate">
            이메일 (뉴스레터)
          </div>
          <span className="text-[11px] text-amber-700 font-medium">CVR 2.6% 달성</span>
        </div>
      </div>

      {/* Visual Chart & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Bar Chart Visualization of Applications by Channel */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>채널별 신청 기여도 및 목표 비중 차트</span>
            </h4>
            <span className="text-xs text-slate-500">단위: 신청 인원 (명)</span>
          </div>

          <div className="space-y-3.5">
            {channels.map((ch) => {
              const pctOfTotal = totalApplications > 0 ? Math.round((ch.applications / totalApplications) * 100) : 0;
              const barWidth = Math.round((ch.applications / maxApplications) * 100);

              return (
                <div key={ch.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getChannelIcon(ch.iconName)}
                      <span className="font-semibold text-slate-800">{ch.channelName}</span>
                      <span className="text-[10px] text-slate-400">({ch.targetAudience.slice(0, 18)}...)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{ch.applications}명</span>
                      <span className="text-[11px] text-slate-500 font-medium">({pctOfTotal}%)</span>
                    </div>
                  </div>

                  {/* Visual Bar with Gradient */}
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex items-center">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>노출 {ch.impressions.toLocaleString()}회 · 클릭 {ch.clicks}건</span>
                    <span>클릭률 {ch.ctr}% · 전환율 {ch.cvr}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Funnel & Key Findings */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>유입 퍼널 및 홍보 시사점</span>
              </h4>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                전환율 우수
              </span>
            </div>

            {/* Funnel Steps */}
            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span className="font-medium text-slate-700">전체 채널 노출</span>
                </div>
                <span className="font-bold text-slate-900">{totalImpressions.toLocaleString()} 회</span>
              </div>

              <div className="w-full flex justify-center text-slate-400 text-[10px]">
                ↓ 클릭 전환율 (CTR) {avgCtr}%
              </div>

              <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span className="font-medium text-slate-700">상세 안내 유입 클릭</span>
                </div>
                <span className="font-bold text-slate-900">{totalClicks.toLocaleString()} 건</span>
              </div>

              <div className="w-full flex justify-center text-slate-400 text-[10px]">
                ↓ 신청 전환율 (CVR) {avgCvr}%
              </div>

              <div className="bg-blue-50/60 rounded-lg p-2.5 border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span className="font-bold text-blue-900">최종 교육 신청</span>
                </div>
                <span className="font-extrabold text-blue-700">{totalApplications} 명</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-[11px]">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>실무 운영진 분석 코멘트</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              <strong>사내 인트라넷 게시판</strong>이 전체 신청자의 <strong>43.6%</strong>를 유치하여 가장 주효한 볼륨 창구로 작동 중입니다.
              <strong>이메일 공문</strong>은 정밀 타깃팅으로 가장 높은 <strong>CVR 2.6%</strong>를 달성했습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Channel Performance Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h4 className="text-sm font-bold text-slate-900">채널별 상세 성과 데이터 시트</h4>
          <span className="text-xs text-slate-500">컬럼 제목을 클릭하여 정렬할 수 있습니다.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">채널명</th>
                <th className="py-3 px-3">타깃 대상</th>
                <th
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('impressions')}
                >
                  <div className="flex items-center gap-1">
                    <span>노출수</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('clicks')}
                >
                  <div className="flex items-center gap-1">
                    <span>클릭수</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">클릭률 (CTR)</th>
                <th
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('applications')}
                >
                  <div className="flex items-center gap-1 font-bold text-blue-700">
                    <span>신청 인원</span>
                    <ArrowUpDown className="w-3 h-3 text-blue-600" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={() => handleSort('cvr')}
                >
                  <div className="flex items-center gap-1">
                    <span>전환율 (CVR)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3">운영 상태</th>
                <th className="py-3 px-3 text-center">리드 필터</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedChannels.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                    {getChannelIcon(ch.iconName)}
                    <span>{ch.channelName}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate">
                    {ch.targetAudience}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {ch.impressions.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    {ch.clicks.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {ch.ctr}%
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {ch.applications}명
                    </span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-emerald-700">
                    {ch.cvr}%
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        ch.status === '진행중'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ch.status === '예정'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {ch.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {onSelectChannelFilter && (
                      <button
                        onClick={() => onSelectChannelFilter(ch.channelName)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        신청자 보기
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
