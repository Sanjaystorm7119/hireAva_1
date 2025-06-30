"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar";
import Image from "next/image";
import { SidebarOptions } from "../../../services/constants"; // Named import, not default
import Link from "next/link";

import { useUser } from "@clerk/nextjs";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const path = usePathname();
  const { user, isLoaded } = useUser();
  if (!isLoaded || !user) return null;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row items-center px-4">
          <Image
            className="h-[70px] w-[70px]"
            src={"../Ava_icon_32.svg"}
            width={70}
            height={70}
            alt="Ava_icon_32"
          />
          {/* <p className="font-bold">Welcome, {user.firstName || "User"}</p>   */}
          <div>
            <h3 className="font-bold">Ava,</h3>
            <h3 className="font-bold">by stelleHire</h3>
          </div>
        </div>
        <Button className="w-full my-2">
          <Plus />
          Create New interview
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SidebarOptions.map((option, index) => (
              <SidebarMenuItem className="" key={index}>
                <SidebarMenuButton
                  asChild
                  className={`${path == option.path && "bg-blue-100 w-full"}`}
                >
                  <Link href={option.path} className="flex items-center gap-2">
                    <option.icon className="h-4 w-4" />
                    <span
                      className={`${
                        path == option.path && "text-primary font-medium"
                      }`}
                    >
                      {option.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
