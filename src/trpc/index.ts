import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../db/index';

export const appRouter = router({
  authCallback: publicProcedure.query(async (input) => {
    const { getUser } = getKindeServerSession();
    const user = getUser();
    if (!user || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id as string
      }
    })

    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id as string,
          email: user.email as string,
        }
      })
    }
    
    return { success: true, user: { email: user.email } };
  }),

  test: publicProcedure.query(() => {
    return 'Hello world!';
  })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;