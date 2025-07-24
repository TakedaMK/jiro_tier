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
  const { setNodeRef, isOver } = useDroppable({
    id: tier.name,
  });

  const tierRestaurants = restaurants.filter(restaurant => restaurant.tier === tier.name);

  return (
    <div
      ref={setNodeRef}
      className={`tier-row ${isOver ? 'drag-over' : ''}`}
      style={{
        borderColor: tier.color,
        minHeight: '80px', // 最小高さを増加
        position: 'relative', // 位置を相対に
        // ドロップ可能エリアを明確にする
        cursor: isOver ? 'pointer' : 'default',
      }}
      data-tier={tier.name}
      data-testid={`tier-${tier.name}`} // テスト用ID
      // ドロップ可能エリアの範囲を明確にする
      data-droppable="true"
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
          backgroundColor: isOver ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
          borderRadius: '4px',
          transition: 'background-color 0.2s ease',
        }}
      >
        <SortableContext items={tierRestaurants.map(r => r.id)} strategy={verticalListSortingStrategy}>
          {tierRestaurants.map(restaurant => (
            <SortableRestaurantItem key={restaurant.id} restaurant={restaurant} />
          ))}
        </SortableContext>
        {/* 空のTierの場合のプレースホルダー */}
        {tierRestaurants.length === 0 && (
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