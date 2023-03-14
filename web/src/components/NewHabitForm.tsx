import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { useMutation } from "react-query";
import { api } from "../libs/axios";
import AppToast, { AppToastProps } from "./AppToast";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

interface NewMutationReqBody {
  title: string;
  weekDays: number[];
}

export default function NewHabitForm() {
  const [toast, setToast] =
    useState<Pick<AppToastProps, "description" | "type" | "title">>();

  const [title, setTitle] = useState<string>("");
  const [weekDays, setWeekDays] = useState<number[]>([]);

  const newHabitMutation = useMutation(async (data: NewMutationReqBody) => {
    const { title, weekDays } = data;
    await api.post("/habits", { title, weekDays });
  });

  async function createNewHabit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title || weekDays.length === 0) return;

    await newHabitMutation.mutateAsync(
      { title: title.trim(), weekDays },
      {
        onSuccess() {
          setToast({
            type: "success",
            title: "Hábito criado!",
            description: `O hábito ${title} foi criado com sucesso!`,
          });
          setTitle("");
          setWeekDays([]);
        },
        onError() {
          setToast({
            type: "error",
            title: "Algo de errado aconteceu!",
            description: "Não foi possível criar o hábito.",
          });
        },
      }
    );
  }

  function handleToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays
        .filter((day) => day !== weekDay)
        .sort((a, b) => a - b);

      setWeekDays(weekDaysWithRemovedOne);
    } else {
      setWeekDays((prevWeekDays) =>
        [...prevWeekDays, weekDay].sort((a, b) => a - b)
      );
    }
  }

  return (
    <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual o seu comprometimento?
      </label>
      <input
        type="text"
        id="title"
        name="title"
        placeholder="Ecercícios, dormir bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        autoFocus
      />

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="flex flex-col gap-2 mt-3">
        {availableWeekDays.map((weekDay, index) => (
          <Checkbox.Root
            key={weekDay}
            className="flex items-center gap-3 group"
            checked={weekDays.includes(index)}
            onCheckedChange={() => handleToggleWeekDay(index)}
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-700 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>

            <span className="text-white leading-tight">{weekDay}</span>
          </Checkbox.Root>
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500"
      >
        <Check size={20} weight="bold" />
        Confirmar
      </button>

      <AppToast
        {...toast}
        open={!!toast}
        onOpenChange={() => setToast(undefined)}
      />
    </form>
  );
}
