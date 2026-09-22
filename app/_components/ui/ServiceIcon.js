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
