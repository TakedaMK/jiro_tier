import React, { useState, useRef } from 'react';
import '../TierList.css';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TIERS, INITIAL_RESTAURANTS, Restaurant } from './types';
import { checkEXRestrictions } from './utils';
import { DroppableTier } from './TierComponent';
import { DraggingRestaurantItem } from './RestaurantItem';
import { SaveButton } from './SaveButton';

const TierList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const tierListRef = useRef<HTMLDivElement>(null);

  // センサーの設定（タッチとポインター）
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // より敏感に
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150, // より早く
        tolerance: 2, // より敏感に
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedRestaurant = restaurants.find(r => r.id === active.id);
    if (draggedRestaurant) {
      setActiveRestaurant(draggedRestaurant);
      console.log('Drag start:', draggedRestaurant.name); // デバッグ用
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    console.log('Drag end - active:', active.id, 'over:', over?.id); // デバッグ用

    setActiveRestaurant(null);

    // ドロップ先が見つからない場合は何もしない（アイテムを削除しない）
    if (!over) {
      console.log('No drop target - keeping item in place'); // デバッグ用
      return;
    }

    const draggedRestaurant = restaurants.find(r => r.id === active.id);
    if (!draggedRestaurant) {
      console.log('Dragged restaurant not found'); // デバッグ用
      return;
    }

    // ドロップ先が有効なTierかチェック
    const validTiers = TIERS.map(tier => tier.name);
    const targetTier = over.id as string;

    // 無効なドロップ先の場合は何もしない
    if (!validTiers.includes(targetTier)) {
      console.log('Invalid drop target:', targetTier, '- keeping item in place'); // デバッグ用
      return;
    }

    console.log('Target tier:', targetTier); // デバッグ用

    // EXの特別な制限をチェック
    if (!checkEXRestrictions(draggedRestaurant, targetTier)) {
      console.log('EX restrictions applied'); // デバッグ用
      return;
    }

    // 同じTier内での移動
    if (draggedRestaurant.tier === targetTier) {
      console.log('Same tier movement'); // デバッグ用
      const tierRestaurants = restaurants.filter(r => r.tier === targetTier);
      const oldIndex = tierRestaurants.findIndex(r => r.id === active.id);
      const newIndex = tierRestaurants.findIndex(r => r.id === over.id);

      console.log('Old index:', oldIndex, 'New index:', newIndex); // デバッグ用

      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        const newTierRestaurants = arrayMove(tierRestaurants, oldIndex, newIndex);
        const otherTiers = restaurants.filter(r => r.tier !== targetTier);
        const newRestaurants = [...otherTiers, ...newTierRestaurants];
        console.log('Updating restaurants for same tier'); // デバッグ用
        setRestaurants(newRestaurants);
      }
    } else {
      // 異なるTier間での移動
      console.log('Different tier movement'); // デバッグ用
      const newRestaurants = restaurants.map(restaurant =>
        restaurant.id === active.id
          ? { ...restaurant, tier: targetTier }
          : restaurant
      );
      console.log('Updating restaurants for different tier'); // デバッグ用
      setRestaurants(newRestaurants);
    }
  };

  // ドラッグオーバー時の処理を追加
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (over) {
      console.log('Drag over:', active.id, '->', over.id); // デバッグ用
    }
  };

  return (
    <div className="tier-list-container">
      <SaveButton tierListRef={tierListRef} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        // ドロップ可能エリア外でのドロップを防ぐ
        modifiers={[]}
      >
        <div className="tier-list-vertical" ref={tierListRef}>
          {TIERS.map((tier) => (
            <DroppableTier key={tier.name} tier={tier} restaurants={restaurants} />
          ))}
        </div>
        <DragOverlay>
          {activeRestaurant ? <DraggingRestaurantItem restaurant={activeRestaurant} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TierList;