import { User } from "@/schemas";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserTable } from "./_components/user-table";

export default async function AdminDashboardPage() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (session == null) return redirect("/sign-in");
	const hasAccess = await auth.api.userHasPermission({
		headers: await headers(),
		body: { permissions: { user: ["list"] } },
	});
	if (!hasAccess.success) return redirect("/sign-in");

	const users = await auth.api.listUsers({
		headers: await headers(),
		query: {
			limit: 100,
			sortBy: "createdAt",
			sortDirection: "desc",
			filterField: "role",
			filterValue: "user",
			filterOperator: "eq",
		},
	});

	return (
		<div className="flex flex-col">
			<div className="flex flex-col px-4 lg:px-6 py-4 md:py-6">
				<h1 className="text-3xl text-black dark:text-white font-medium leading-tight">
					All Users ({users.users.length})
				</h1>
				<p className="text-base font-normal text-muted-foreground leading-tight">
					Manage website users and their roles.
				</p>
			</div>
			<UserTable data={users.users as User[]} />
		</div>
	);
}
