import { create } from "zustand";

interface Position {
  id: number;
  title: string;
  department: string;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
}

interface PositionStore {
  positions: Position[];
  addPosition: (position: Omit<Position, "id">) => void;
  removePosition: (id: number) => void;
  updatePosition: (id: number, position: Partial<Position>) => void;
}

export const usePositionStore = create<PositionStore>((set) => ({
  positions: [],

  addPosition: (position) =>
    set((state) => ({
      positions: [
        ...state.positions,
        {
          ...position,
          id: Date.now(), // 使用时间戳作为临时ID
        },
      ],
    })),

  removePosition: (id) =>
    set((state) => ({
      positions: state.positions.filter((position) => position.id !== id),
    })),

  updatePosition: (id, updatedPosition) =>
    set((state) => ({
      positions: state.positions.map((position) =>
        position.id === id ? { ...position, ...updatedPosition } : position
      ),
    })),
}));
