import useStore from "../store";
import { trpc } from "../utils/trpc";

// クライアントでキャッシュされているデータを編集するため、trpcのuseContext()を用いる
const useMutateTask = () => {
  const utils = trpc.useContext(); // server/trpc/router/todoと同じメソッドが使える！
  const reset = useStore((state) => state.resetEditedTask); // なぜresetが必要？？

  const createTaskMutation = trpc.todo.createTask.useMutation({
    onSuccess: (res) => {
      // 既存のキャッシュを取得する
      const previousTodos = utils.todo.getTasks.getData();
      if (previousTodos) {
        // 新しいタスクを先頭に追加してキャッシュを更新
        utils.todo.getTasks.setData([res, ...previousTodos]);
      }
      reset();
    },
  });

  const updateTaskMutation = trpc.todo.updateTask.useMutation({
    onSuccess: (res) => {
      const previousTodos = utils.todo.getTasks.getData();
      if (previousTodos) {
        utils.todo.getTasks.setData(
          previousTodos.map((task) => (task.id === res.id ? res : task))
        );
      }
      reset();
    },
  });

  const deleteTaskMutation = trpc.todo.deleteTask.useMutation({
    onSuccess: (_, variables) => {
      const previousTodos = utils.todo.getTasks.getData();
      if (previousTodos) {
        utils.todo.getTasks.setData(
          // 削除した taskに一致しないものをfilteringしてキャッシュに保存する
          previousTodos.filter((task) => task.id !== variables.taskId)
        );
      }
      reset();
    },
  });

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation };
};

export default useMutateTask;
