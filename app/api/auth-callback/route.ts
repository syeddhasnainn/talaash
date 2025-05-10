import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getUser, addUser } from "@/actions/userActions";

export async function GET(req: NextRequest){
    const user = await currentUser()
    if (!user) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    const userExists = await getUser(user.id)
    if (!userExists) {
        await addUser(user.id, user.fullName!, user.emailAddresses[0].emailAddress)
    }
    return NextResponse.redirect(new URL('/chat', req.url));
}