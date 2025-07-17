"use client";
import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "../lib/supabase";

function Provider({ children }) {
  const { user, isLoaded } = useUser();

  const createOrUpdateUser = async () => {
    if (!isLoaded || !user) return;

    try {
      const { data: existingUsers, error: queryError } = await supabase
        .from("Users")
        .select("*")
        .eq("email", user.primaryEmailAddress?.emailAddress);

      if (queryError) throw queryError;

      if (!existingUsers || existingUsers.length === 0) {
        const userData = {
          clerk_user_id: user.id,
          name: user.fullName || user.firstName || "Unknown",
          email: user.primaryEmailAddress?.emailAddress,
          picture: user.imageUrl,
          created_at: new Date().toISOString(),
          firstname: user.firstName,
          lastname: user.lastName,
        };

        const { error: insertError } = await supabase
          .from("Users")
          .insert([userData]);

        if (insertError) throw insertError;
      } else {
        const existingUser = existingUsers[0];
        const hasUpdates =
          existingUser.name !== (user.fullName || user.firstName) ||
          existingUser.picture !== user.imageUrl;

        if (hasUpdates) {
          const { error: updateError } = await supabase
            .from("Users")
            .update({
              name: user.fullName || user.firstName || "Unknown",
              picture: user.imageUrl,
            })
            .eq("clerk_user_id", user.id);

          if (updateError) throw updateError;
        }
      }
    } catch (error) {
      console.error("Error syncing user:", error);
    }
  };

  useEffect(() => {
    createOrUpdateUser();
  }, [user, isLoaded]);

  return <div>{children}</div>;
}

export default Provider;
