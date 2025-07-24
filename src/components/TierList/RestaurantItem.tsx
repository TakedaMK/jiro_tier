import React from 'react';
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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: restaurant.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'grab',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
    position: isDragging ? 'relative' as const : 'static' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`restaurant-item ${isDragging ? 'dragging' : ''}`}
      data-name={restaurant.name}
      data-id={restaurant.id}
      data-tier={restaurant.tier}
      {...attributes}
      {...listeners}
      onMouseDown={() => console.log('Mouse down on:', restaurant.name)} // デバッグ用
      onTouchStart={() => console.log('Touch start on:', restaurant.name)} // デバッグ用
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