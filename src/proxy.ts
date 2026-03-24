import { getSession } from "@/lib/getSession";
import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "./constant";

export async function proxy(req:NextRequest) {
    const session = await getSession()
    if(!session){
        return NextResponse.redirect(API_URL)
    }
    return NextResponse.next()
}

export const config = {
    matcher: '/dashboard/:path*'
}