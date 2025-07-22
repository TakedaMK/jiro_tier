import React, { useState, useRef, useEffect } from 'react';
import './TierList.css';
import html2canvas from 'html2canvas';

export interface Restaurant {
  id: string;
  name: string;
  tier: string;
}

export interface Tier {
  name: string;
  color: string;
}

const TIERS: Tier[] = [
  { name: 'SSS', color: '#FFD700' },
  { name: 'SS', color: '#C0C0C0' },
  { name: 'S', color: '#FF6B6B' },
  { name: 'A', color: '#45B7D1' },
  { name: 'A-', color: '#96CEB4' },
  { name: 'B', color: '#FFEAA7' },
  { name: 'C', color: '#DDA0DD' },
];

const INITIAL_RESTAURANTS: Restaurant[] = [
  { id: '1', name: '三田', tier: 'SSS' },
  { id: '2', name: '目黒', tier: 'A' },
  { id: '3', name: '仙川', tier: 'B' },
  { id: '4', name: '歌舞伎町', tier: 'C' },
  { id: '5', name: '品川', tier: 'A+' },
  { id: '6', name: '小滝橋', tier: 'B' },
  { id: '7', name: '環七新代田', tier: 'B' },
  { id: '8', name: '野猿街道', tier: 'S' },
  { id: '9', name: '池袋', tier: 'C' },
  { id: '10', name: '亀戸', tier: 'S' },
  { id: '11', name: '京急川崎', tier: 'A' },
  { id: '12', name: '府中', tier: 'A' },
  { id: '13', name: '松戸', tier: 'SS' },
  { id: '14', name: 'めじろ台', tier: 'A' },
  { id: '15', name: '荻窪', tier: 'A' },
  { id: '16', name: '上野毛', tier: 'A' },
  { id: '17', name: '京成大久保', tier: 'A' },
  { id: '18', name: '環七一之江', tier: 'A+' },
  { id: '19', name: '相模大野', tier: 'A+' },
  { id: '20', name: '横浜関内', tier: 'SSS' },
  { id: '21', name: '神田神保町', tier: 'A+' },
  { id: '22', name: '小岩', tier: 'SS' },
  { id: '23', name: 'ひばりヶ丘', tier: 'SS' },
  { id: '24', name: '栃木街道', tier: 'A' },
  { id: '25', name: '立川', tier: 'A-' },
  { id: '26', name: '千住大橋', tier: 'A' },
  { id: '27', name: '湘南藤沢', tier: 'S' },
  { id: '28', name: '西台', tier: 'B' },
  { id: '29', name: '中山', tier: 'SS' },
  { id: '30', name: '仙台', tier: 'A+' },
  { id: '31', name: '札幌', tier: 'A-' },
  { id: '32', name: '会津若松', tier: 'A-' },
  { id: '33', name: '新潟', tier: 'A' },
  { id: '34', name: '川越', tier: 'A+' },
  { id: '35', name: '京都', tier: 'A' },
  { id: '36', name: '越谷', tier: 'B' },
  { id: '37', name: '前橋千代田', tier: 'A' },
  { id: '38', name: '千葉', tier: 'S' },
  { id: '39', name: '大宮公園', tier: 'A' },
  { id: '40', name: 'ひたちなか', tier: 'S' },
  { id: '41', name: '一橋学園', tier: 'A+' },
  { id: '42', name: '柏', tier: 'B' },
  { id: '43', name: '生田', tier: 'A-' },
  { id: '44', name: '朝倉街道', tier: 'S' },
];

const TierList: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [draggedItem, setDraggedItem] = useState<Restaurant | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const tierListRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, restaurant: Restaurant) => {
    setDraggedItem(restaurant);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetTier: string, targetIndex?: number) => {
    e.preventDefault();
    if (draggedItem) {
      setRestaurants(prev => {
        const newRestaurants = [...prev];
        const draggedIndex = newRestaurants.findIndex(r => r.id === draggedItem.id);

        // 同じTier内での順番変更
        if (draggedItem.tier === targetTier) {
          const tierRestaurants = newRestaurants.filter(r => r.tier === targetTier);
          const currentIndex = tierRestaurants.findIndex(r => r.id === draggedItem.id);

          // 新しい順番を計算
          let newIndex = targetIndex !== undefined ? targetIndex : tierRestaurants.length - 1;
          if (newIndex > currentIndex) newIndex--;

          // 順番を変更
          const reorderedTier = [...tierRestaurants];
          const [movedItem] = reorderedTier.splice(currentIndex, 1);
          reorderedTier.splice(newIndex, 0, movedItem);

          // 新しい配列を作成
          const otherTiers = newRestaurants.filter(r => r.tier !== targetTier);
          return [...otherTiers, ...reorderedTier];
        } else {
          // 異なるTier間での移動
          newRestaurants[draggedIndex] = { ...draggedItem, tier: targetTier };
          return newRestaurants;
        }
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragOverRestaurant = (e: React.DragEvent, restaurant: Restaurant) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== restaurant.id) {
      setDragOverTarget(restaurant.id);
    }
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDropOnRestaurant = (e: React.DragEvent, targetRestaurant: Restaurant) => {
    e.preventDefault();
    if (draggedItem && draggedItem.id !== targetRestaurant.id) {
      const targetTier = targetRestaurant.tier;
      const tierRestaurants = restaurants.filter(r => r.tier === targetTier);
      const targetIndex = tierRestaurants.findIndex(r => r.id === targetRestaurant.id);

      handleDrop(e, targetTier, targetIndex);
    }
  };

  const handleTouchStart = (e: React.TouchEvent, restaurant: Restaurant) => {
    setDraggedItem(restaurant);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const tierElement = element?.closest('.tier-column');

    if (tierElement && draggedItem) {
      const tierName = tierElement.getAttribute('data-tier');
      if (tierName && tierName !== draggedItem.tier) {
        setRestaurants(prev =>
          prev.map(restaurant =>
            restaurant.id === draggedItem.id
              ? { ...restaurant, tier: tierName }
              : restaurant
          )
        );
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  // 画像保存処理
  const handleSaveImage = async () => {
    if (tierListRef.current) {
      const canvas = await html2canvas(tierListRef.current, {backgroundColor: null, scale: 2});
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'tierlist.png';
      link.click();
    }
  };

  return (
    <div className="tier-list-container">
      <button
        onClick={handleSaveImage}
        style={{
          display: 'block',
          margin: '0 auto 16px auto',
          padding: '12px 32px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          background: '#ffe600',
          color: '#111',
          border: '2px solid #ffb800',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}
      >
        画像として保存
      </button>
      <div className="tier-list-vertical" ref={tierListRef}>
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="tier-row"
            style={{ borderColor: tier.color }}
            data-tier={tier.name}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, tier.name)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="tier-label" style={{ backgroundColor: tier.color }}>
              {tier.name}
            </div>
            <div className="tier-content">
              {restaurants
                .filter(restaurant => restaurant.tier === tier.name)
                .map(restaurant => {
                  // 「ラーメン」部分を赤、それ以外を黒で分割
                  const name = restaurant.name;
                  const ramenIndex = name.indexOf('ラーメン');
                  let displayName;
                  if (ramenIndex !== -1) {
                    displayName = (
                      <>
                        <span className="ramen-red">{name.slice(ramenIndex, ramenIndex + 4)}</span>
                        <span className="ramen-black">{name.slice(ramenIndex + 4)}</span>
                      </>
                    );
                  } else {
                    displayName = <span className="ramen-black">{name}</span>;
                  }
                  return (
                    <div
                      key={restaurant.id}
                      className={`restaurant-item ${isDragging && draggedItem?.id === restaurant.id ? 'dragging' : ''} ${dragOverTarget === restaurant.id ? 'drop-target' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, restaurant)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOverRestaurant(e, restaurant)}
                      onDragLeave={handleDragLeave}
                      onTouchStart={(e) => handleTouchStart(e, restaurant)}
                      onDrop={(e) => handleDropOnRestaurant(e, restaurant)}
                      ref={dragRef}
                    >
                      {displayName}
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TierList;