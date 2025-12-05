interface SectionTitleProps {
  title: string;
  subtitle?: string;
}

export const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <div className="space-y-2">
      <h2 className="heading-hero">{title}</h2>
      {subtitle && <p className="text-sm text-text-dim">{subtitle}</p>}
    </div>
  );
};
