import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FIRESTORE_COLLECTIONS } from '../types';

// 店舗データ
const testTenpoData = [
  {
    "tenpo_CD": 2,
    "tenpo_name": "目黒",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 1
  },
  {
    "tenpo_CD": 3,
    "tenpo_name": "仙川",
    "rank_CD": 7,
    "haishi_flag": 0,
    "display_order": 1
  },
  {
    "tenpo_CD": 4,
    "tenpo_name": "歌舞伎町",
    "rank_CD": 8,
    "haishi_flag": 0,
    "display_order": 1
  },
  {
    "tenpo_CD": 5,
    "tenpo_name": "品川",
    "rank_CD": 4,
    "haishi_flag": 0,
    "display_order": 1
  },
  {
    "tenpo_CD": 6,
    "tenpo_name": "小滝橋",
    "rank_CD": 6,
    "haishi_flag": 0,
    "display_order": 1
  },
  {
    "tenpo_CD": 7,
    "tenpo_name": "環七新代田",
    "rank_CD": 7,
    "haishi_flag": 0,
    "display_order": 2
  },
  {
    "tenpo_CD": 8,
    "tenpo_name": "野猿街道",
    "rank_CD": 3,
    "haishi_flag": 0,
    "display_order": 1
  },
  {
    "tenpo_CD": 9,
    "tenpo_name": "池袋",
    "rank_CD": 8,
    "haishi_flag": 0,
    "display_order": 2
  },
  {
    "tenpo_CD": 10,
    "tenpo_name": "亀戸",
    "rank_CD": 3,
    "haishi_flag": 0,
    "display_order": 2
  },
  {
    "tenpo_CD": 11,
    "tenpo_name": "京急川崎",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 2
  },
  {
    "tenpo_CD": 12,
    "tenpo_name": "府中",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 3
  },
  {
    "tenpo_CD": 13,
    "tenpo_name": "松戸",
    "rank_CD": 2,
    "haishi_flag": 0,
    "display_order": 1
  },
  {
    "tenpo_CD": 14,
    "tenpo_name": "めじろ台",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 4
  },
  {
    "tenpo_CD": 15,
    "tenpo_name": "荻窪",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 5
  },
  {
    "tenpo_CD": 16,
    "tenpo_name": "上野毛",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 6
  },
  {
    "tenpo_CD": 17,
    "tenpo_name": "京成大久保",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 7
  },
  {
    "tenpo_CD": 18,
    "tenpo_name": "環七一之江",
    "rank_CD": 4,
    "haishi_flag": 0,
    "display_order": 2
  },
  {
    "tenpo_CD": 19,
    "tenpo_name": "相模大野",
    "rank_CD": 3,
    "haishi_flag": 0,
    "display_order": 3
  },
  {
    "tenpo_CD": 20,
    "tenpo_name": "横浜関内",
    "rank_CD": 1,
    "haishi_flag": 0,
    "display_order": 1
  },
  {
    "tenpo_CD": 21,
    "tenpo_name": "神田神保町",
    "rank_CD": 4,
    "haishi_flag": 0,
    "display_order": 3
  },
  {
    "tenpo_CD": 22,
    "tenpo_name": "小岩",
    "rank_CD": 2,
    "haishi_flag": 0,
    "display_order": 2
  },
  {
    "tenpo_CD": 23,
    "tenpo_name": "ひばりヶ丘",
    "rank_CD": 2,
    "haishi_flag": 0,
    "display_order": 3
  },
  {
    "tenpo_CD": 24,
    "tenpo_name": "栃木街道",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 8
  },
  {
    "tenpo_CD": 25,
    "tenpo_name": "立川",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 9
  },
  {
    "tenpo_CD": 26,
    "tenpo_name": "千住大橋",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 10
  },
  {
    "tenpo_CD": 27,
    "tenpo_name": "湘南藤沢",
    "rank_CD": 3,
    "haishi_flag": 0,
    "display_order": 4
  },
  {
    "tenpo_CD": 28,
    "tenpo_name": "西台",
    "rank_CD": 7,
    "haishi_flag": 0,
    "display_order": 3
  },
  {
    "tenpo_CD": 29,
    "tenpo_name": "中山",
    "rank_CD": 4,
    "haishi_flag": 0,
    "display_order": 4
  },
  {
    "tenpo_CD": 30,
    "tenpo_name": "仙台",
    "rank_CD": 4,
    "haishi_flag": 0,
    "display_order": 5
  },
  {
    "tenpo_CD": 31,
    "tenpo_name": "札幌",
    "rank_CD": 6,
    "haishi_flag": 0,
    "display_order": 2
  },
  {
    "tenpo_CD": 32,
    "tenpo_name": "会津若松",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 11
  },
  {
    "tenpo_CD": 33,
    "tenpo_name": "新潟",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 12
  },
  {
    "tenpo_CD": 34,
    "tenpo_name": "川越",
    "rank_CD": 4,
    "haishi_flag": 0,
    "display_order": 6
  },
  {
    "tenpo_CD": 35,
    "tenpo_name": "京都",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 13
  },
  {
    "tenpo_CD": 36,
    "tenpo_name": "越谷",
    "rank_CD": 7,
    "haishi_flag": 0,
    "display_order": 4
  },
  {
    "tenpo_CD": 37,
    "tenpo_name": "前橋千代田",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 14
  },
  {
    "tenpo_CD": 38,
    "tenpo_name": "千葉",
    "rank_CD": 2,
    "haishi_flag": 0,
    "display_order": 4
  },
  {
    "tenpo_CD": 39,
    "tenpo_name": "大宮公園",
    "rank_CD": 5,
    "haishi_flag": 0,
    "display_order": 15
  },
  {
    "tenpo_CD": 40,
    "tenpo_name": "ひたちなか",
    "rank_CD": 3,
    "haishi_flag": 0,
    "display_order": 5
  },
  {
    "tenpo_CD": 41,
    "tenpo_name": "一橋学園",
    "rank_CD": 4,
    "haishi_flag": 0,
    "display_order": 7
  },
  {
    "tenpo_CD": 42,
    "tenpo_name": "柏",
    "rank_CD": 7,
    "haishi_flag": 0,
    "display_order": 5
  },
  {
    "tenpo_CD": 43,
    "tenpo_name": "生田",
    "rank_CD": 6,
    "haishi_flag": 0,
    "display_order": 3
  },
  {
    "tenpo_CD": 44,
    "tenpo_name": "朝倉街道",
    "rank_CD": 3,
    "haishi_flag": 0,
    "display_order": 6
  }
];

/**
 * 店舗データをFirestoreに投入する関数
 * ドキュメントIDをtenpo_CDと同じにする
 */
export const seedTenpoData = async (): Promise<void> => {
  try {
    console.log('店舗データの投入を開始します...');

    const tenposCollection = collection(db, FIRESTORE_COLLECTIONS.TENPOS);

    for (const tenpo of testTenpoData) {
      // ドキュメントIDをtenpo_CDと同じにする
      const docRef = doc(tenposCollection, tenpo.tenpo_CD.toString());

      const tenpoData = {
        tenpo_CD: tenpo.tenpo_CD,
        tenpo_name: tenpo.tenpo_name,
        rank_CD: tenpo.rank_CD,
        haishi_flag: tenpo.haishi_flag,
        display_order: tenpo.display_order,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(docRef, tenpoData);
      console.log(`店舗データを投入しました: ${tenpo.tenpo_name} (ID: ${tenpo.tenpo_CD})`);
    }

    console.log('店舗データの投入が完了しました！');
  } catch (error) {
    console.error('店舗データの投入でエラーが発生しました:', error);
    throw error;
  }
};

/**
 * 投入された店舗データを確認する関数
 */
export const verifyTenpoData = async (): Promise<void> => {
  try {
    console.log('投入された店舗データを確認します...');

    const tenposCollection = collection(db, FIRESTORE_COLLECTIONS.TENPOS);
    const snapshot = await getDocs(tenposCollection);

    console.log(`投入された店舗数: ${snapshot.size}`);

    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${data.tenpo_name} (ID: ${doc.id}, ランク: ${data.rank_CD})`);
    });

    console.log('店舗データの確認が完了しました！');
  } catch (error) {
    console.error('店舗データの確認でエラーが発生しました:', error);
    throw error;
  }
};