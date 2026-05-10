import type { Skill, ValueItem } from "@/types";

export const aboutContent = {
  intro:
    "我是 Cheers，一名持续通过项目构建能力边界的开发者。我的主线是 Java / Spring 开发，同时也在把 AI 实验、图像方向探索和工程落地能力逐步串成一个更完整的技术栈。",
  directions: [
    "Java / Spring 后端开发与服务搭建",
    "AI 应用实践，从实验原型到场景验证",
    "工程化与项目落地，关注可维护性与交付节奏",
  ],
  currentFocus: [
    "把 AI 能力接入真实工作流，而不是停留在实验展示。",
    "沉淀可以复用的工程模板、部署基线和项目结构。",
    "在写作中整理自己的判断方式，让项目与思考同步成长。",
  ],
  workflow: [
    "先做一个足够小但完整的闭环，再迭代结构和体验。",
    "重视复盘文档，把踩坑、判断与取舍写清楚。",
    "优先解决真实问题，而不是只追逐新技术标签。",
  ],
  values: [
    {
      title: "持续学习",
      description: "把学习放进真实项目里，用可运行结果检验理解，而不是只停留在概念层面。",
    },
    {
      title: "工程实践",
      description: "重视结构、部署、可维护性与交付方式，让项目真正具备继续演进的基础。",
    },
    {
      title: "独立思考",
      description: "不急着追逐热点，先判断问题边界、实际价值和实现成本。",
    },
    {
      title: "解决真实问题",
      description: "更在意技术如何接入场景、改善流程，而不是只展示技术本身。",
    },
  ] satisfies ValueItem[],
};

export const skillGroups: Array<{ title: string; skills: Skill[] }> = [
  {
    title: "Backend / 后端开发",
    skills: [
      { name: "Java", category: "Backend", level: "Core" },
      { name: "Spring Boot", category: "Backend", level: "Core" },
      { name: "MySQL", category: "Backend", level: "Advanced" },
      { name: "Git", category: "Backend", level: "Advanced" },
    ],
  },
  {
    title: "AI / Vision",
    skills: [
      { name: "Python", category: "AI", level: "Advanced" },
      { name: "Deep Learning", category: "AI", level: "Working" },
      { name: "Computer Vision", category: "AI", level: "Working" },
    ],
  },
  {
    title: "Frontend / Delivery",
    skills: [
      { name: "Next.js", category: "Frontend", level: "Working" },
      { name: "Tailwind CSS", category: "Frontend", level: "Working" },
      { name: "Docker", category: "Delivery", level: "Advanced" },
    ],
  },
];

export const values: ValueItem[] = aboutContent.values;
