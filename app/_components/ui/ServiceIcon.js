import {
  Bot,
  Gauge,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  MonitorDown,
  Palette,
  ShoppingBag,
  Smartphone,
} from "lucide-react";

// services-data.js stores an icon name rather than a component, so the data
// module stays a plain data module and can be read on the server.
const icons = {
  Bot,
  Gauge,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  MonitorDown,
  Palette,
  ShoppingBag,
  Smartphone,
};

export default function ServiceIcon({ name, className = "h-6 w-6", ...props }) {
  const Icon = icons[name] ?? Globe;
  return <Icon className={className} strokeWidth={1.6} {...props} />;
}

export const accentVar = {
  primary: "var(--color-primary)",
  secondary: "var(--color-secondary)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
};

// Accents are now painted as solid blocks rather than a 10% wash, so each one
// needs to say what colour sits legibly on top of it. Lime and amber take ink,
// cobalt and green take paper.
export const accentInk = {
  primary: "var(--color-ink)",
  secondary: "var(--color-on-dark)",
  success: "var(--color-on-dark)",
  warning: "var(--color-ink)",
};
