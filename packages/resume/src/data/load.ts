import yaml from 'js-yaml';
import type { Resume, Role } from './types';

function requireString(value: unknown, path: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`resume.yaml: "${path}" must be a non-empty string`);
  }
  return value;
}

function parseRole(raw: Record<string, unknown>, index: number): Role {
  const path = `experience[${index}]`;
  const achievements = raw.achievements;
  if (!Array.isArray(achievements) || achievements.length === 0) {
    throw new Error(`resume.yaml: "${path}.achievements" must be a non-empty list`);
  }
  return {
    title: requireString(raw.title, `${path}.title`),
    company: requireString(raw.company, `${path}.company`),
    location: typeof raw.location === 'string' ? raw.location : undefined,
    date: requireString(raw.date, `${path}.date`),
    achievements: achievements.map((a, i) => requireString(a, `${path}.achievements[${i}]`)),
  };
}

/** Parses and validates the resume yaml. Throws with the offending path on bad input. */
export function parseResume(source: string): Resume {
  const raw = yaml.load(source) as Record<string, any> | undefined;
  if (!raw || typeof raw !== 'object') throw new Error('resume.yaml: empty or not a mapping');
  const header = raw.header ?? {};
  if (!Array.isArray(raw.experience)) throw new Error('resume.yaml: "experience" must be a list');
  const resume: Resume = {
    header: {
      name: requireString(header.name, 'header.name'),
      title: requireString(header.title, 'header.title'),
      email: requireString(header.email, 'header.email'),
      phone: requireString(String(header.phone ?? ''), 'header.phone'),
      location: requireString(header.location, 'header.location'),
      website: typeof header.website === 'string' ? header.website : undefined,
    },
    experience: raw.experience.map(parseRole),
  };
  return resume;
}
