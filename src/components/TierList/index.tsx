import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';
import { Restaurant, TIERS, INITIAL_RESTAURANTS } from './types';
import { DroppableTier } from './TierComponent';
import { SortableRestaurantItem, DraggingRestaurantItem } from './RestaurantItem';
import SaveButton from './SaveButton';
import '../TierList.css';

const TierList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [activeRestaurant, setActiveRestaurant] = useState<Restaurant | null>(null);
  const tierListRef = useRef<HTMLDivElement>(null);

  // センサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 2,
      },
    })
  );

  // ドラッグ開始時の処理
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedRestaurant = restaurants.find(r => r.id === active.id);
    if (draggedRestaurant) {
      setActiveRestaurant(draggedRestaurant);
      console.log('Drag start:', draggedRestaurant.name);
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('Drag end - active:', active.id, 'over:', over?.id);

    // 必ずactiveRestaurantをクリア
    setActiveRestaurant(null);

    if (!over) {
      console.log('No valid drop target');
      return;
    }

    const draggedRestaurant = restaurants.find(r => r.id === active.id);
    const targetTier = over.id as string;

    if (!draggedRestaurant) {
      console.log('Dragged restaurant not found');
      return;
    }

    // 三田の場合は移動を無効化
    if (draggedRestaurant.name === '三田') {
      console.log('三田は移動できません');
      return;
    }

    // 同じTier内での移動
    if (draggedRestaurant.tier === targetTier) {
      const tierRestaurants = restaurants.filter(r => r.tier === targetTier);
      const oldIndex = tierRestaurants.findIndex(r => r.id === active.id);
      const newIndex = tierRestaurants.findIndex(r => r.id === over.id);

      console.log('Same tier - oldIndex:', oldIndex, 'newIndex:', newIndex);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        // 同じTier内での並び替え
        const newTierRestaurants = arrayMove(tierRestaurants, oldIndex, newIndex);
        const otherRestaurants = restaurants.filter(r => r.tier !== targetTier);
        const newRestaurants = [...otherRestaurants, ...newTierRestaurants];

        console.log('Updating same tier order');
        setRestaurants(newRestaurants);
      }
    } else {
      // 異なるTierへの移動
      console.log('Cross tier move:', draggedRestaurant.name, '->', targetTier);

      const updatedRestaurants = restaurants.map(restaurant => {
        if (restaurant.id === active.id) {
          return { ...restaurant, tier: targetTier };
        }
        return restaurant;
      });

      setRestaurants(updatedRestaurants);
    }
  };

  // ドラッグオーバー時の処理
  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      console.log('Drag over:', over.id);
    }
  };

  return (
    <div className="tier-list-container">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
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
      <SaveButton tierListRef={tierListRef} />
    </div>
  );
};

export default TierList;