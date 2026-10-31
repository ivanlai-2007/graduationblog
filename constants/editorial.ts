import { Language } from '../types';
export interface EditorialFrame { id: string; src: string; title: Record<Language, string>; description: Record<Language, string>; category: 'space' | 'everyday' | 'light'; ratio: string; }
export const EDITORIAL_FRAMES: EditorialFrame[] = [
  { id: 'red-hour', src: '/editorial/red-hour.jpg', title: { en: 'The red hour', 'zh-CN': '红色的片刻', 'zh-TW': '紅色的片刻' }, description: { en: 'A line of red, held between architecture and the sea.', 'zh-CN': '一抹红，在建筑与海之间停留。', 'zh-TW': '一抹紅，在建築與海之間停留。' }, category: 'space', ratio: '3 / 2' },
  { id: 'still-court', src: '/editorial/still-court.jpg', title: { en: 'After the rain', 'zh-CN': '雨后，无人入座', 'zh-TW': '雨後，無人入座' }, description: { en: 'An ordinary chair. A quiet court. A different way of looking.', 'zh-CN': '一张椅子，一座空球场，换一种观看日常的方式。', 'zh-TW': '一張椅子，一座空球場，換一種觀看日常的方式。' }, category: 'everyday', ratio: '2 / 3' },
  { id: 'last-light', src: '/editorial/last-light.jpg', title: { en: 'The light that stays', 'zh-CN': '光留下的形状', 'zh-TW': '光留下的形狀' }, description: { en: 'Even the briefest light leaves something behind.', 'zh-CN': '再短暂的光，也会留下自己的形状。', 'zh-TW': '再短暫的光，也會留下自己的形狀。' }, category: 'light', ratio: '3 / 2' },
];
export const FRAME_CATEGORIES = { space: { en: 'Space', 'zh-CN': '空间', 'zh-TW': '空間' }, everyday: { en: 'Everyday', 'zh-CN': '日常', 'zh-TW': '日常' }, light: { en: 'Light', 'zh-CN': '光影', 'zh-TW': '光影' } };
