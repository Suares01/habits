import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Bug, Check, CircleNotch } from "phosphor-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { api } from "../libs/axios";

interface HabitsListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void;
}

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export default function HabitsList({
  date,
  onCompletedChanged,
}: HabitsListProps) {
  const {
    data: habitsInfo,
    isLoading,
    isSuccess,
  } = useQuery<HabitsInfo>(["day", date.toISOString()], async () => {
    const { data } = await api.get<HabitsInfo>(
      `/day?date=${date.toISOString()}`
    );
    return data;
  });

  const queryClient = useQueryClient();

  const toggleHabitMutation = useMutation(async (habitId: string) => {
    await api.patch(`/habits/${habitId}/toggle`);
  });

  async function handleToggleHabit(habitId: string) {
    await toggleHabitMutation.mutateAsync(habitId, {
      onSuccess() {
        const currentHabitsInfo = queryClient.getQueryData<HabitsInfo>([
          "day",
          date.toISOString(),
        ]);

        const isHabitAlreadyCompleted =
          currentHabitsInfo!.completedHabits.includes(habitId);

        let completedHabits: string[] = [];

        if (isHabitAlreadyCompleted) {
          completedHabits = currentHabitsInfo!.completedHabits.filter(
            (id) => id !== habitId
          );
        } else {
          completedHabits = [...currentHabitsInfo!.completedHabits, habitId];
        }

        queryClient.setQueryData<HabitsInfo>(["day", date.toISOString()], {
          possibleHabits: currentHabitsInfo!.possibleHabits,
          completedHabits,
        });

        onCompletedChanged(completedHabits.length);
      },
    });
  }

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date());

  return (
    <div className="mt-6 flex flex-col gap-3">
      {isLoading ? (
        <div className="flex justify-center items-center gap-1 w-full">
          <CircleNotch className="animate-spin text-zinc-400" size={20} />
          <span className="text-zinc-400 text-lg font-semibold">
            Carregando hábitos
          </span>
        </div>
      ) : isSuccess ? (
        habitsInfo.possibleHabits.map((habit) => {
          return (
            <Checkbox.Root
              key={habit.id}
              onCheckedChange={() => handleToggleHabit(habit.id)}
              checked={habitsInfo.completedHabits.includes(habit.id)}
              disabled={isDateInPast}
              className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed"
            >
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-50 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background">
                <Checkbox.Indicator>
                  <Check size={20} className="text-white" />
                </Checkbox.Indicator>
              </div>

              <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                {habit.title}
              </span>
            </Checkbox.Root>
          );
        })
      ) : (
        <div className="flex flex-col justify-center items-center gap-1 w-full">
          <Bug size={20} className="text-zinc-400" />
          <span className="text-zinc-400 text-lg font-extrabold">
            Ops... Algo de errado aconteceu!
          </span>
          <span className="text-zinc-400 text-base font-extrabold">
            Tente reiniciar a página.
          </span>
        </div>
      )}
    </div>
  );
}
