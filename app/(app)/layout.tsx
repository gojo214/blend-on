import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import {AppSidebar} from '@/features/sidebar/app-sidebar'

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}