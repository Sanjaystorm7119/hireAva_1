import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from '../../../lib/supabase';

export async function POST(request: NextRequest) {
    try {
        const user = await currentUser();
        
        if (!user?.primaryEmailAddress?.emailAddress) {
            return NextResponse.json(
                { error: "No user email found" }, 
                { status: 401 }
            );
        }

        // Check if user already exists
        const { data: users, error } = await supabase
            .from('Users')
            .select('*')
            .eq('email', user.primaryEmailAddress.emailAddress);

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { error: "Database error" }, 
                { status: 500 }
            );
        }

        // If user doesn't exist, create new user
        if (users && users.length === 0) {
            const { data: newUser, error: insertError } = await supabase
                .from('Users')
                .insert([
                    {
                        email: user.primaryEmailAddress.emailAddress,
                        // Add other user fields as needed
                        // name: user.firstName + ' ' + user.lastName,
                        // clerk_id: user.id,
                    }
                ])
                .select()
                .single();

            if (insertError) {
                console.error('Insert error:', insertError);
                return NextResponse.json(
                    { error: "Failed to create user" }, 
                    { status: 500 }
                );
            }

            return NextResponse.json(newUser);
        }

        // Return existing user
        return NextResponse.json(users[0]);
        
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: "Internal server error" }, 
            { status: 500 }
        );
    }
}