import type { Feature } from "@/lib/types";

export const TEAM_DESCRIPTION = `Funk & Love是浙江大学DFM街舞社的Locking团队，我们用充满律动的锁舞诠释放克精神。Locking是一种充满欢乐和表现力的街舞风格，以突然的"锁定"动作、指向性手势Point和夸张的表情为特征。`;

export const TEAM_PHILOSOPHY = "用舞蹈传递快乐";

export const FEATURES: Feature[] = [
  {
    icon: "Scale",
    title: "平等的",
    description: "我们尊重每个队员的声音"
  },
  {
    icon: "Heart",
    title: "包容的",
    description: "接纳不同背景和水平的舞者，共同成长进步"
  },
  {
    icon: "Users",
    title: "真诚的",
    description: "用真心对待每一位成员，建立信任与友谊"
  },
  {
    icon: "Sparkles",
    title: "热烈的",
    description: "充满激情与活力，用舞蹈点燃生活的热情"
  }
];

export const RECRUIT_CONTACT = {
  name: "dragon",
  wechat: "superhandsomezwl",
  term: "25届",
} as const;
