import * as React from "react"
import { Link, useLocation } from "wouter"
import { cn, getInitials } from "@/lib/utils"
import { useAuthStore } from "@/store/authStore"
import { useThemeStore } from "@/store/themeStore"
import { 
  LayoutDashboard, Search, Heart, MessageCircle, 
  Calendar, Repeat, Star, User, Settings, ShieldAlert,
  LogOut, Menu, X, Bell, Moon, Sun 
} from "lucide-react"
import logoPath from "@assets/skillswaplogo_1784374390885.png"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { useNotificationsStore } from "@/store/notificationsStore"
import { Badge } from "../ui/badge"

const NavLink = ({ href, icon: Icon, children, exact = false, onClick }: any) => {
  const [location] = useLocation()
  const active = exact ? location === href : location.startsWith(href)
  
  return (
    <Link href={href} className="w-full" onClick={onClick}>
      <div className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}>
        <Icon className="h-5 w-5" />
        <span>{children}</span>
      </div>
    </Link>
  )
}

export function Sidebar() {
  const { user, logout } = useAuthStore()
  const { unreadCount } = useNotificationsStore()
  const { theme, toggleTheme } = useThemeStore()
  const [, setLocation] = useLocation()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    setLocation("/")
  }

  const closeMobile = () => setMobileOpen(false)

  const content = (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold" onClick={closeMobile}>
          <img src={logoPath} alt="SkillSwap" className="h-8 w-8" />
          <span className="text-lg tracking-tight">SkillSwap</span>
        </Link>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium gap-1">
          <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</div>
          <NavLink href="/dashboard" icon={LayoutDashboard} exact onClick={closeMobile}>Dashboard</NavLink>
          <NavLink href="/marketplace" icon={Search} onClick={closeMobile}>Marketplace</NavLink>
          <NavLink href="/matches" icon={Heart} onClick={closeMobile}>Matches</NavLink>
          <NavLink href="/chat" icon={MessageCircle} onClick={closeMobile}>Chats</NavLink>
          <NavLink href="/scheduler" icon={Calendar} onClick={closeMobile}>Sessions</NavLink>
          <NavLink href="/swap-request" icon={Repeat} onClick={closeMobile}>Requests</NavLink>
          <NavLink href="/ratings" icon={Star} onClick={closeMobile}>Reviews</NavLink>
          
          <div className="px-2 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personal</div>
          <NavLink href="/profile" icon={User} onClick={closeMobile}>Profile</NavLink>
          
          <div className="relative">
            <NavLink href="/notifications" icon={Bell} onClick={closeMobile}>Notifications</NavLink>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="absolute right-2 top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </div>
          
          <NavLink href="/settings" icon={Settings} onClick={closeMobile}>Settings</NavLink>
          
          {user.isAdmin && (
            <>
              <div className="px-2 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</div>
              <NavLink href="/admin" icon={ShieldAlert} onClick={closeMobile}>Overview</NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="border-t p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="outline" size="sm" className="w-full flex justify-between" onClick={toggleTheme}>
            <span className="text-xs">Theme</span>
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Avatar className={cn("h-10 w-10", user.avatarColor)}>
            <AvatarFallback className="text-white bg-transparent">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
            <LogOut className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile topbar */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src={logoPath} alt="SkillSwap" className="h-8 w-8" />
          <span className="font-bold text-lg">SkillSwap</span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/notifications" className="relative p-2">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive"></span>
            )}
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={closeMobile} />
          <div className="relative w-3/4 max-w-sm bg-background h-full shadow-xl flex flex-col">
            {content}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/20 lg:block lg:w-[280px] xl:w-[300px] h-screen sticky top-0">
        {content}
      </div>
    </>
  )
}
