import type { Generation } from "@/lib/types";

export function buildMemberImageUrl(term: string, name: string, ext: string = "jpg"): string {
  return `/images/members/${term}/${name}.${ext}`;
}

export const GENERATIONS: Generation[] = [
  { term: "17届", year: "2017", members: [], isCollecting: true },
  { term: "18届", year: "2018", members: [], isCollecting: true },
  { term: "19届", year: "2019", members: [], isCollecting: true },
  {
    term: "20届",
    year: "2020",
    members: [
      { name: "小雪", image: buildMemberImageUrl("20届", "小雪") },
      { name: "库库", image: buildMemberImageUrl("20届", "库库") },
      { name: "裤子", image: buildMemberImageUrl("20届", "裤子") },
      { name: "贝贝", image: buildMemberImageUrl("20届", "贝贝") },
    ]
  },
  {
    term: "21届",
    year: "2021",
    members: [
      { name: "小明", image: buildMemberImageUrl("21届", "小明") },
      { name: "皮蛋", image: buildMemberImageUrl("21届", "皮蛋") },
    ]
  },
  {
    term: "22届",
    year: "2022",
    members: [
      { name: "JOJO", image: buildMemberImageUrl("22届", "JOJO") },
      { name: "兔老大", image: buildMemberImageUrl("22届", "兔老大") },
      { name: "十七", image: buildMemberImageUrl("22届", "十七") },
      { name: "土豆", image: buildMemberImageUrl("22届", "土豆") },
      { name: "小白", image: buildMemberImageUrl("22届", "小白") },
      { name: "橡皮", image: buildMemberImageUrl("22届", "橡皮") },
      { name: "氧", image: buildMemberImageUrl("22届", "氧") },
      { name: "水母", image: buildMemberImageUrl("22届", "水母") },
      { name: "觥筹", image: buildMemberImageUrl("22届", "觥筹") },
      { name: "阿珂", image: buildMemberImageUrl("22届", "阿珂") },
    ]
  },
  {
    term: "23届",
    year: "2023",
    members: [
      { name: "学妹", image: buildMemberImageUrl("23届", "学妹") },
      { name: "小查", image: buildMemberImageUrl("23届", "小查") },
      { name: "栗子", image: buildMemberImageUrl("23届", "栗子") },
      { name: "阿威", image: buildMemberImageUrl("23届", "阿威") },
    ]
  },
  {
    term: "24届",
    year: "2024",
    members: [
      { name: "dragon", image: buildMemberImageUrl("24届", "dragon") },
      { name: "kk", image: buildMemberImageUrl("24届", "kk") },
      { name: "Mandy", image: buildMemberImageUrl("24届", "Mandy") },
      { name: "sunny", image: buildMemberImageUrl("24届", "sunny") },
      { name: "噗噗", image: buildMemberImageUrl("24届", "噗噗") },
      { name: "小智", image: buildMemberImageUrl("24届", "小智") },
      { name: "杭子", image: buildMemberImageUrl("24届", "杭子", "png") },
      { name: "阿fai", image: buildMemberImageUrl("24届", "阿fai") },
    ]
  },
  {
    term: "25届",
    year: "2025",
    members: [
      { name: "bc", image: buildMemberImageUrl("25届", "bc") },
      { name: "Hofmann", image: buildMemberImageUrl("25届", "Hofmann") },
      { name: "乙烯", image: buildMemberImageUrl("25届", "乙烯") },
      { name: "姜姜", image: buildMemberImageUrl("25届", "姜姜") },
      { name: "小咩", image: buildMemberImageUrl("25届", "小咩") },
      { name: "小展", image: buildMemberImageUrl("25届", "小展") },
      { name: "晓秾", image: buildMemberImageUrl("25届", "晓秾") },
      { name: "树叶", image: buildMemberImageUrl("25届", "树叶") },
      { name: "猫头鹰", image: buildMemberImageUrl("25届", "猫头鹰", "png") },
      { name: "萝卜", image: buildMemberImageUrl("25届", "萝卜") },
      { name: "豆子", image: buildMemberImageUrl("25届", "豆子") },
      { name: "饺子", image: buildMemberImageUrl("25届", "饺子") },
    ]
  }
];
