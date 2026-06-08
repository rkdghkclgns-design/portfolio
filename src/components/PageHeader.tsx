import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

/**
 * PageHeader – 모든 서브페이지(이력서, 포트폴리오, 플레이 이력)에서
 * 동일한 디자인·위치·크기로 사용되는 공통 상단 바 컴포넌트.
 *
 * 절대 이 파일의 버튼 스타일을 개별 파일에서 재정의하지 마세요.
 * 변경이 필요하면 이 파일만 수정하세요.
 */
interface PageHeaderProps {
  onBack: () => void;
  /** 오른쪽에 표시할 부제목 라벨 (예: "Resume", "Portfolio") */
  label?: string;
  /** 중앙 슬롯: 탭 전환 버튼 등 추가 UI를 삽입할 경우 사용 */
  centerSlot?: React.ReactNode;
  /** 우측 슬롯: 다운로드 버튼 등 추가 UI를 삽입할 경우 사용 */
  rightSlot?: React.ReactNode;
}

export const PageHeader = ({ onBack, label, centerSlot, rightSlot }: PageHeaderProps) => {
  return (
    <div className="relative flex flex-row items-center justify-between gap-4 py-4 border-y border-black/5 mb-12 -mx-6 px-6 md:-mx-12 md:px-12 bg-white/80 backdrop-blur-md sticky top-[64px] z-40">
      {/* 왼쪽: 뒤로가기 버튼 (고정 너비 영역) */}
      <div className="flex items-center gap-3 w-[220px] shrink-0">
        <button
          onClick={onBack}
          className="w-[170px] h-[40px] flex items-center justify-center gap-2.5 bg-zinc-100 hover:bg-white hover:shadow-sm border border-black/[0.06] rounded-full text-zinc-500 hover:text-[#0047BB] transition-all duration-300 font-bold text-sm"
        >
          <motion.span
            className="flex items-center"
            whileHover={{ x: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.span>
          <span>메인으로 돌아가기</span>
        </button>
        {label && (
          <div className="flex items-center gap-2 text-zinc-300 hidden md:flex">
            <div className="w-px h-4 bg-zinc-200" />
            <span className="text-[10px] font-black tracking-widest uppercase">{label}</span>
          </div>
        )}
      </div>

      {/* 중앙: 탭 등 옵션 슬롯 */}
      <div className="flex-1 flex justify-center">
        {centerSlot}
      </div>

      {/* 오른쪽: 추가 액션 버튼 등 옵션 슬롯 (고정 너비 영역) */}
      <div className="w-[220px] shrink-0 flex justify-end">
        {rightSlot}
      </div>
    </div>
  );
};
