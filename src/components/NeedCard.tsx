import {
  Blocks,
  BrainCircuit,
  BriefcaseBusiness,
  Map,
  MessageCircleMore,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { NeedEntry } from '../types/content';

const icons: Record<NeedEntry['icon'], LucideIcon> = {
  sparkles: Sparkles,
  briefcase: BriefcaseBusiness,
  map: Map,
  brain: BrainCircuit,
  blocks: Blocks,
  message: MessageCircleMore,
};

export function NeedCard({ entry }: { entry: NeedEntry }) {
  const Icon = icons[entry.icon];
  return (
    <Link className={`need-card accent-${entry.accent}`} data-testid="need-entry" to={entry.href}>
      <div className="need-card__top">
        <span className="need-card__icon" aria-hidden="true"><Icon size={20} strokeWidth={2.1} /></span>
        <span className="need-card__arrow" aria-hidden="true">↗</span>
      </div>
      <div>
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
      </div>
      <div className="need-card__meta">
        <span>{entry.duration}</span>
        <span>{entry.output}</span>
      </div>
    </Link>
  );
}
