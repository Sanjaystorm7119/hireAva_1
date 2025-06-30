import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import AppSideBar from "../(main)/_components/AppsideBar";
import Welcome from "./dashboard/_components/Welcome";

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <main className="flex-1">
        <SidebarTrigger />
        <Welcome />
        {children}
      </main>
    </SidebarProvider>
  );
}
export default DashboardProvider;
