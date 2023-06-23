import create from "zustand";
import { updateTaskInput } from "../schema/todo";

type State = {
  editedTask: updateTaskInput;
  updateEditedTask: (payload: updateTaskInput) => void;
  resetEditedTask: () => void;
};

const initTask = { taskId: "", title: "", body: "" };

const useStore = create<State>((set) => ({
  editedTask: initTask,
  updateEditedTask: (payload) => set({ editedTask: payload }),
  resetEditedTask: () => set({ editedTask: initTask }),
}));
export default useStore;
