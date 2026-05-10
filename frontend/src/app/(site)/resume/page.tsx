import Link from "next/link";

import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { SkillTag } from "@/components/SkillTag";
import { TimelineItem } from "@/components/TimelineItem";
import {
  certifications,
  education,
  experience,
  resumeProjects,
  resumeSkills,
} from "@/data/resume";

export default function ResumePage() {
  return (
    <PageContainer className="max-w-6xl">
      <PageHeader
        title="Resume 简历"
        description="一个更正式、清晰的履历视图，用于概览教育背景、核心技能、项目经验和持续积累中的工程实践。"
        meta={[
          { label: "Role Focus", value: "Java / Spring Developer" },
          { label: "Secondary Focus", value: "AI applications / delivery" },
        ]}
        action={
          <Link href="#" className="button-primary">
            Download Resume
          </Link>
        }
      />

      <section className="grid gap-6 pb-10">
        <div className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Education / 教育背景</span>
          <div className="grid gap-5">
            {education.map((item) => (
              <TimelineItem key={item.title} item={item} />
            ))}
          </div>
        </div>

        <div className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Skills / 技能概览</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {resumeSkills.map((skill) => (
              <SkillTag key={skill} label={skill} tone="accent" />
            ))}
          </div>
        </div>

        <div className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Projects / 项目经历</span>
          <div className="grid gap-5">
            {resumeProjects.map((item) => (
              <TimelineItem key={item.title} item={item} />
            ))}
          </div>
        </div>

        <div className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Experience / 实践经历</span>
          <div className="grid gap-5">
            {experience.map((item) => (
              <TimelineItem key={item.title} item={item} />
            ))}
          </div>
        </div>

        <div className="surface px-6 py-6 lg:px-8">
          <span className="eyebrow">Awards / Certifications</span>
          <div className="grid gap-5">
            {certifications.map((item) => (
              <TimelineItem key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
