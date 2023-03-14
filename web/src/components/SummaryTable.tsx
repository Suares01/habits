import dayjs from "dayjs";
import { Bug, CircleNotch } from "phosphor-react";
import { useQuery } from "react-query";
import { api } from "../libs/axios";
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-Beginning";
import HabitDay from "./HabitDay";

export interface Summary {
  id: string;
  date: string;
  completed: number;
  amount: number;
}

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBeginning();

const minimunSummaryDatesSize = 18 * 7;
const amountOfDaysToFill = minimunSummaryDatesSize - summaryDates.length;

export default function SummaryTable() {
  const {
    data: summary,
    isLoading,
    isSuccess,
  } = useQuery<Summary[]>(["summary"], async () => {
    const { data } = await api.get<Summary[]>("/summary");
    return data;
  });

  return (
    <section className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => (
          <div
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
          >
            {weekDay}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center gap-1 w-full">
          <CircleNotch className="animate-spin text-zinc-400" size={32} />
          <span className="text-zinc-400 text-xl font-semibold">
            Carregando resumo
          </span>
        </div>
      ) : isSuccess ? (
        <div className="grid grid-rows-7 grid-flow-col gap-3">
          {summaryDates.map((date) => {
            const dayInSummary = summary.find((day) =>
              dayjs(date).isSame(day.date, "day")
            );

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            );
          })}

          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => (
              <div
                key={index}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
              />
            ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center gap-1 w-full">
          <Bug size={48} className="text-zinc-400" />
          <span className="text-zinc-400 text-xl font-extrabold">
            Ops... Algo de errado aconteceu!
          </span>
          <span className="text-zinc-400 text-lg font-extrabold">
            Tente reiniciar a página.
          </span>
        </div>
      )}
    </section>
  );
}
