import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Restaurant } from './types';

interface RestaurantItemProps {
  restaurant: Restaurant;
}

// 「ラーメン」部分を赤、それ以外を黒で分割する関数
const formatRestaurantName = (name: string) => {
  const ramenIndex = name.indexOf('ラーメン');
  if (ramenIndex !== -1) {
    return (
      <>
        <span className="ramen-red">{name.slice(ramenIndex, ramenIndex + 4)}</span>
        <span className="ramen-black">{name.slice(ramenIndex + 4)}</span>
      </>
    );
  } else {
    return <span className="ramen-black">{name}</span>;
  }
};

export const SortableRestaurantItem: React.FC<RestaurantItemProps> = ({ restaurant }) => {
  // 三田の場合はドラッグアンドドロップを無効化
  const isFixed = restaurant.name === '三田';
  const scrollIntervalRef = useRef<number | null>(null);
  const lastTouchYRef = useRef<number>(0);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: restaurant.id,
    disabled: isFixed, // 三田の場合は無効化
  });

  // スクロール処理をクリーンアップ
  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };
  }, []);

  // 自動スクロール処理
  const startAutoScroll = (direction: 'up' | 'down') => {
    if (scrollIntervalRef.current) return;

    const scrollSpeed = 8; // スクロール速度を調整
    const scrollStep = direction === 'up' ? -scrollSpeed : scrollSpeed;

    scrollIntervalRef.current = window.setInterval(() => {
      window.scrollBy(0, scrollStep);
    }, 16); // 約60fps
  };

  // 自動スクロール停止
  const stopAutoScroll = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // スクロール防止のためのイベントハンドラー
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isFixed) {
      console.log('Touch start on:', restaurant.name);
      lastTouchYRef.current = e.touches[0].clientY;
      // タッチ開始時はpreventDefaultを呼ばない（@dnd-kitに任せる）
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isFixed && isDragging) {
      const touchY = e.touches[0].clientY;
      const windowHeight = window.innerHeight;
      const scrollThreshold = 80; // スクロール開始の閾値を調整

      // 画面の上部でドラッグしている場合
      if (touchY < scrollThreshold) {
        startAutoScroll('up');
      }
      // 画面の下部でドラッグしている場合
      else if (touchY > windowHeight - scrollThreshold) {
        startAutoScroll('down');
      }
      // 画面の中央部分では自動スクロールを停止
      else {
        stopAutoScroll();
      }

      lastTouchYRef.current = touchY;
      // ドラッグ中でもpreventDefaultは呼ばない（自動スクロールを許可）
    }
  };

  const handleTouchEnd = () => {
    stopAutoScroll();
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isFixed ? 'default' : (isDragging ? 'grabbing' : 'grab'),
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: isDragging ? 'relative' as const : 'static' as const,
    touchAction: isFixed ? 'auto' : 'pan-y', // スクロールを許可
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`restaurant-item ${isDragging ? 'dragging' : ''} ${isFixed ? 'fixed-item' : ''}`}
      data-name={restaurant.name}
      data-id={restaurant.id}
      data-tier={restaurant.tier}
      {...(isFixed ? {} : attributes)}
      {...(isFixed ? {} : listeners)}
      onMouseDown={() => console.log('Mouse down on:', restaurant.name)} // デバッグ用
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {formatRestaurantName(restaurant.name)}
    </div>
  );
};

export const DraggingRestaurantItem: React.FC<RestaurantItemProps> = ({ restaurant }) => {
  return (
    <div
      className="restaurant-item dragging"
      data-name={restaurant.name}
      data-id={restaurant.id}
      style={{
        transform: 'rotate(5deg) scale(1.05)',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
      }}
    >
      {formatRestaurantName(restaurant.name)}
    </div>
  );
};