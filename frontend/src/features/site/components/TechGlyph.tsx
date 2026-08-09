import { TECH_GLYPHS, type TechSlug } from './tech-glyphs';

type TechGlyphProps = {
  slug: TechSlug;
  className?: string;
  title?: string;
};

/** Glifo de marca de uma tecnologia. Herda `currentColor`. */
export function TechGlyph({ slug, className, title }: TechGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={TECH_GLYPHS[slug]} />
    </svg>
  );
}
