import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { games } from "@/db";
import {AppSidebar} from '@/features/sidebar/app-sidebar'
import { listGame } from "@/lib/games/queries"

export default async function AppLayout({ children }: LayoutProps<"/">) {

  const game = await listGame();

  return (
    <SidebarProvider>
      <AppSidebar games={game}/>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}