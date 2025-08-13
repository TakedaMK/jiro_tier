import React, { useState, useRef, useEffect } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const tierListRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // スクロール制御の設定
  useEffect(() => {
    // ドラッグ中のスクロール制御は削除（RestaurantItem.tsxで処理）
    // 画面固定処理を削除して、自動スクロール機能を有効にする
  }, [isDragging]);

  // 自動スクロール機能
  useEffect(() => {
    if (!isDragging || !dragPosition || !tierListRef.current) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }

    const container = tierListRef.current;
    const containerRect = container.getBoundingClientRect();
    const scrollThreshold = 100; // スクロール開始の閾値（ピクセル）
    const scrollSpeed = 10; // スクロール速度（ピクセル/フレーム）

    // 上端スクロール
    if (dragPosition.y < containerRect.top + scrollThreshold) {
      const scrollDistance = scrollThreshold - (dragPosition.y - containerRect.top);
      const scrollAmount = Math.min(scrollSpeed, scrollDistance);

      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }

      autoScrollIntervalRef.current = setInterval(() => {
        container.scrollTop -= scrollAmount;
      }, 16); // 約60fps
    }
    // 下端スクロール
    else if (dragPosition.y > containerRect.bottom - scrollThreshold) {
      const scrollDistance = dragPosition.y - (containerRect.bottom - scrollThreshold);
      const scrollAmount = Math.min(scrollSpeed, scrollDistance);

      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }

      autoScrollIntervalRef.current = setInterval(() => {
        container.scrollTop += scrollAmount;
      }, 16); // 約60fps
    }
    // スクロール不要な領域
    else {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isDragging, dragPosition]);

  // ドラッグ開始時の処理
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const draggedRestaurant = restaurants.find(r => r.id === active.id);
    if (draggedRestaurant) {
      setActiveRestaurant(draggedRestaurant);
      setIsDragging(true);
      console.log('Drag start:', draggedRestaurant.name);
    }
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    console.log('Drag end - active:', active.id, 'over:', over?.id);

    // 状態をリセット
    setActiveRestaurant(null);
    setIsDragging(false);
    setDragPosition(null);

    if (!over) {
      console.log('No valid drop target - item will return to original position');
      // ドロップ可能エリア外でドロップされた場合は何もしない（元の位置に戻る）
      return;
    }

    const draggedRestaurant = restaurants.find(r => r.id === active.id);

    if (!draggedRestaurant) {
      console.log('Dragged restaurant not found');
      return;
    }

    // 三田の場合は移動を無効化
    if (draggedRestaurant.name === '三田') {
      console.log('三田は移動できません');
      return;
    }

    // over.idがレストランIDかTier名かを判定
    const targetRestaurant = restaurants.find(r => r.id === over.id);

    if (targetRestaurant) {
      // over.idがレストランIDの場合 - そのレストランの位置に配置
      console.log('Dropping on restaurant:', targetRestaurant.name);

      const targetTier = targetRestaurant.tier;
      const tierRestaurants = restaurants.filter(r => r.tier === targetTier);
      const oldIndex = tierRestaurants.findIndex(r => r.id === active.id);
      const targetIndex = tierRestaurants.findIndex(r => r.id === over.id);

      console.log('Target restaurant index:', targetIndex);

      if (oldIndex !== -1 && targetIndex !== -1) {
        if (draggedRestaurant.tier === targetTier) {
          // 同じTier内での移動
          if (oldIndex !== targetIndex) {
            const newTierRestaurants = arrayMove(tierRestaurants, oldIndex, targetIndex);
            const otherRestaurants = restaurants.filter(r => r.tier !== targetTier);
            const newRestaurants = [...otherRestaurants, ...newTierRestaurants];

            console.log('Moving within same tier to position:', targetIndex);
            setRestaurants(newRestaurants);
          }
        } else {
          // 異なるTierへの移動
          console.log('Cross tier move to restaurant position:', targetIndex);

          // ドラッグされたアイテムを削除
          const restaurantsWithoutDragged = restaurants.filter(r => r.id !== active.id);

          // ターゲットTierのアイテムを取得
          const targetTierRestaurants = restaurantsWithoutDragged.filter(r => r.tier === targetTier);

          // ターゲット位置に挿入
          const newTierRestaurants = [
            ...targetTierRestaurants.slice(0, targetIndex),
            { ...draggedRestaurant, tier: targetTier },
            ...targetTierRestaurants.slice(targetIndex)
          ];

          // 他のTierのアイテムと結合
          const otherRestaurants = restaurantsWithoutDragged.filter(r => r.tier !== targetTier);
          const newRestaurants = [...otherRestaurants, ...newTierRestaurants];

          setRestaurants(newRestaurants);
        }
      }
    } else {
      // over.idがTier名の場合 - 従来の処理
      const targetTier = over.id as string;
      console.log('Dropping on tier:', targetTier);

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
    }
  };

  // ドラッグオーバー時の処理
  const handleDragOver = (event: DragOverEvent) => {
    const { over, active } = event;

    // ドラッグ位置を更新
    if (active && active.rect.current.translated) {
      const translated = active.rect.current.translated;
      setDragPosition({
        x: translated.left,
        y: translated.top
      });
    }

    if (over) {
      console.log('Drag over:', over.id);
    }
  };

  return (
    <div className={`tier-list-container ${isDragging ? 'dragging' : ''}`}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        modifiers={[]}
      >
        <div className={`tier-list-vertical ${isDragging ? 'dragging' : ''}`} ref={tierListRef}>
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