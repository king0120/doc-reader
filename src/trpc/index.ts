import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { privateProcedure, publicProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { db } from '../db/index';
import {z} from 'zod';

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
    console.log({dbUser})
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

  getUserFiles: privateProcedure.query(async (input) => {
    const { userId } = input.ctx;
    const files = await db.file.findMany({
      where: {
        userId: userId as string
      }
    })

    return files;
  }),
  getFile: privateProcedure.input(z.object({ key: z.string() })).mutation(async ({input, ctx}) => {
    const { userId } = ctx;
    const file = await db.file.findFirst({
      where: {
        key: input.key,
        userId: userId as string
      }
    })
    if (!file) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return file;
   }),
  deleteFile: privateProcedure.input(z.object({ id: z.string() })).mutation(async ({ input, ctx }) => {
    const { userId } = ctx;
    const file = await db.file.findFirst({
      where: {
        id: input.id,
        userId: userId as string
      }
    })
    if (!file) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    await db.file.delete({
      where: {
        id: input.id
      }
    })
    return { success: true };
  }),
  test: publicProcedure.query(() => {
    return 'Hello world!';
  })
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;