import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Tier, Restaurant } from './types';
import { SortableRestaurantItem } from './RestaurantItem';

interface TierComponentProps {
  tier: Tier;
  restaurants: Restaurant[];
}

export const DroppableTier: React.FC<TierComponentProps> = ({ tier, restaurants }) => {
  // TierEXの場合はドロップ機能を無効化
  const isEX = tier.name === 'EX';

  const { setNodeRef, isOver } = useDroppable({
    id: tier.name,
    disabled: isEX, // TierEXの場合は無効化
  });

  const tierRestaurants = restaurants.filter(restaurant => restaurant.tier === tier.name);

  // ドラッグ可能なアイテムのみをフィルタリング
  const draggableItems = tierRestaurants
    .filter(restaurant => restaurant.name !== '三田')
    .map(restaurant => restaurant.id);

  return (
    <div
      ref={setNodeRef}
      className={`tier-row ${isOver && !isEX ? 'drag-over' : ''}`}
      style={{
        borderColor: tier.color,
        minHeight: '80px', // 最小高さを増加
        position: 'relative', // 位置を相対に
        // ドロップ可能エリアを明確にする
        cursor: isOver && !isEX ? 'pointer' : 'default',
        // Tier全体をドロップ可能エリアにする
        backgroundColor: isOver && !isEX ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        padding: '4px',
        borderWidth: isOver && !isEX ? '4px' : '3px',
      }}
      data-tier={tier.name}
      data-testid={`tier-${tier.name}`} // テスト用ID
      // ドロップ可能エリアの範囲を明確にする
      data-droppable={!isEX ? "true" : "false"}
    >
      <div className="tier-label" style={{ backgroundColor: tier.color }}>
        {tier.name}
      </div>
      <div
        className="tier-content"
        style={{
          minHeight: '60px', // 最小高さを設定
          padding: '8px 0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'flex-start',
          // ドロップ可能エリアを明確にする
          borderRadius: '4px',
        }}
      >
        <SortableContext items={draggableItems} strategy={verticalListSortingStrategy}>
          {tierRestaurants.map(restaurant => (
            <SortableRestaurantItem key={restaurant.id} restaurant={restaurant} />
          ))}
        </SortableContext>
        {/* 空のTierの場合のプレースホルダー（EX以外のみ） */}
        {tierRestaurants.length === 0 && !isEX && (
          <div className="empty-placeholder">
            ここにドロップ
          </div>
        )}
      </div>
    </div>
  );
};