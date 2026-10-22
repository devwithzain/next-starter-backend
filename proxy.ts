import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	const pathname = request.nextUrl.pathname;

	const isSignInPage = pathname === "/sign-in";
	const isSignUpPage = pathname === "/sign-up";

	const userDashboardPath = "/dashboard";
	const adminDashboardPath = "/dashboard";

	if (session) {
		const isAdmin = session.user.role === "admin";

		if (isSignInPage || isSignUpPage) {
			const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
			if (callbackUrl && callbackUrl.startsWith("/")) {
				return NextResponse.redirect(new URL(callbackUrl, request.url));
			}

			if (isAdmin) {
				return NextResponse.redirect(new URL(adminDashboardPath, request.url));
			}

			return NextResponse.redirect(new URL(userDashboardPath, request.url));
		}

		return NextResponse.next();
	}

	if (isSignInPage || isSignUpPage) {
		return NextResponse.next();
	}

	return NextResponse.redirect(new URL("/sign-in", request.url));
}

export const config = {
	matcher: ["/sign-in", "/sign-up", "/dashboard/:path*"],
};
