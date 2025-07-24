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
          backgroundColor: isOver && !isEX ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease',
        }}
      >
        <SortableContext items={draggableItems} strategy={verticalListSortingStrategy}>
          {tierRestaurants.map(restaurant => (
            <SortableRestaurantItem key={restaurant.id} restaurant={restaurant} />
          ))}
        </SortableContext>
        {/* 空のTierの場合のプレースホルダー（EX以外のみ） */}
        {tierRestaurants.length === 0 && !isEX && (
          <div
            style={{
              width: '100%',
              height: '40px',
              border: '2px dashed #ccc',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontSize: '0.9rem',
              backgroundColor: isOver ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            }}
          >
            ここにドロップ
          </div>
        )}
      </div>
    </div>
  );
};