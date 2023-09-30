import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { redirect } from "next/navigation"

export default function DashboardPage() {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) {
        redirect('/auth-callback?origin=dashboard')
    }
    return (
        <div>
            <h1>{user.email}</h1>
        </div>
    )
}