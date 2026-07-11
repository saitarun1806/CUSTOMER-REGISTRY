import heroImage from "../assets/hero.png";

export function SupportIllustration() {
  return <img src={heroImage} alt="Support agent helping a customer" className="illustration-img" />;
}

export function EmptyStateIllustration() {
  return <img src={heroImage} alt="Nothing here yet" className="illustration-img illustration-img-sm" />;
}
