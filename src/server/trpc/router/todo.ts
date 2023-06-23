import {
  createTaskSchema,
  updateTaskInput,
  deleteTaskSchema,
  getSingleTaskSchema,
  updateTaskSchema,
} from "../../../schema/todo";

import { t, authedProcedure } from "../trpc";

export const todoRouter = t.router({
  createTask: authedProcedure
    .input(createTaskSchema)
    // 新規作成はmutation
    .mutation(async ({ ctx, input }) => {
      // create task
      const task = await ctx.prisma.task.create({
        data: {
          ...input,
          user: {
            // connect: 既存のユーザーと紐付け
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });
      return task;
    }),
  getTasks: t.procedure.query(({ ctx }) => {
    return ctx.prisma.task.findMany({
      where: {
        // ログインしているユーザーのタスクのみを取得
        userId: ctx.session?.user?.id,
      },
      orderBy: {
        // 新しい順
        createdAt: "desc",
      },
    });
  }),

  getSingleTask: authedProcedure
    .input(getSingleTaskSchema)
    // 取り寄せはクエリ
    .query(({ ctx, input }) => {
      return ctx.prisma.task.findUnique({
        where: {
          id: input.taskId,
        },
      });
    }),

  updateTask: authedProcedure
    .input(updateTaskSchema)
    // 更新はミューテーション
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.update({
        where: {
          id: input.taskId,
        },
        data: {
          title: input.title,
          body: input.body,
        },
      });
      return task;
    }),

  deleteTask: authedProcedure
    .input(deleteTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.task.delete({
        where: {
          id: input.taskId,
        },
      });
    }),
});
