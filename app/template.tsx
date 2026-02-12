import TemplateWrapper from "@/components/TemplateWrapper";

// Sur /message : pas de carré blanc. Autres pages : carte blanche.

export default function AppTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TemplateWrapper>{children}</TemplateWrapper>;
}
