'use client'
import { useRouter, useSearchParams } from "next/navigation"
import { trpc } from "../_trpc/client"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

const Page = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const origin = searchParams.get('origin')

    const { data: test, isLoading } = trpc.authCallback.useQuery()
    useEffect(() => {
        if (test?.success) {
            router.push(origin ? `/${origin}` : '/dashboard')
        }
    }, [test, isLoading])
    return <div>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3>Setting up your account ...</h3>
    </div>
 }

export default Page