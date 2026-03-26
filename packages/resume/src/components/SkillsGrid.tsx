interface Skill {
  category: string;
  items: string[];
}

interface SkillsGridProps {
  skills: Skill[];
}

export function SkillsGrid({ skills }: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {skills.map((skill, index) => (
        <div key={index} className="break-inside-avoid">
          <h5 className="text-gray-900 dark:text-gray-100 print:text-gray-900 mb-2">{skill.category}</h5>
          <p className="text-gray-400 dark:text-gray-500 print:text-gray-400 leading-relaxed">{skill.items.join(' • ')}</p>
        </div>
      ))}
    </div>
  );
}
