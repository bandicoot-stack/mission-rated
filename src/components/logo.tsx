import { Star } from "lucide-react";

export function Logo() {
  return (
    <a className="logo" href="#top" aria-label="Mission Rated home">
      <span className="logo-mark"><Star size={18} strokeWidth={2.4} /></span>
      <span>MISSION <b>RATED</b></span>
    </a>
  );
}
