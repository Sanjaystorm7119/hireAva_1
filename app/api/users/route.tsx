import { currentUser } from "@clerk/nextjs/dist/types/server";
import { NextApiRequest } from "next";
// import { createClient } from "@supabase/supabase-js";

import {supabase} from '../../../lib/supabase'
import { NextResponse } from "next/server";

export async function POST(params:NextApiRequest) {
    
    const user = await currentUser();

    //if already exist else create
    try{
    const { data: users, error } = await supabase
  .from('Users')
  .select('*')
  .eq('email', user?.primaryEmailAddress?.emailAddress);
  if(users?.length==0){

  }
  return NextResponse.json(users[0])
    }
    catch(e){

    }
}