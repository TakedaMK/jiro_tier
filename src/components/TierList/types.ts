export interface Restaurant {
  id: string;
  name: string;
  tier: string;
}

export interface Tier {
  name: string;
  color: string;
}

export const TIERS: Tier[] = [
  { name: 'EX', color: '#FF1493' },
  { name: 'SSS', color: '#FFD700' },
  { name: 'SS', color: '#C0C0C0' },
  { name: 'S', color: '#FF6B6B' },
  { name: 'A+', color: '#FF8C00' },
  { name: 'A', color: '#45B7D1' },
  { name: 'A-', color: '#96CEB4' },
  { name: 'B', color: '#FFEAA7' },
  { name: 'C', color: '#DDA0DD' },
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  { id: '1', name: '三田', tier: 'EX' },
  { id: '2', name: '目黒', tier: 'A' },
  { id: '3', name: '仙川', tier: 'B' },
  { id: '4', name: '歌舞伎町', tier: 'C' },
  { id: '5', name: '品川', tier: 'A+' },
  { id: '6', name: '小滝橋', tier: 'B' },
  { id: '7', name: '環七新代田', tier: 'B' },
  { id: '8', name: '野猿街道', tier: 'SS' },
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
  { id: '29', name: '中山', tier: 'A+' },
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