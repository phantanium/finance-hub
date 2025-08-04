import {
  Home,
  Droplet,
  TrendingUp,
  BarChart3,
  Activity,
  Users,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    description: "Overview of all ratios"
  },
  {
    title: "Liquidity Ratios",
    url: "/liquidity",
    icon: Droplet,
    description: "Current, Quick & Cash Ratios"
  },
  {
    title: "Profitability Ratios",
    url: "/profitability",
    icon: TrendingUp,
    description: "ROE, ROA, NPM & GPM"
  },
  {
    title: "Leverage Ratios",
    url: "/leverage",
    icon: BarChart3,
    description: "DER, DAR & Times Interest Earned"
  },
  {
    title: "Activity Ratios",
    url: "/activity",
    icon: Activity,
    description: "Asset & Inventory Turnover"
  },
  {
    title: "Company Comparison",
    url: "/comparison",
    icon: Users,
    description: "Side-by-side analysis"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Dashboard preferences"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-accent hover:text-accent-foreground transition-smooth";

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} border-r border-border bg-sidebar transition-smooth`}
      collapsible="icon"
    >
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Financial Analysis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={getNavCls}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium truncate">{item.title}</span>
                          <span className="text-xs opacity-75 truncate">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}