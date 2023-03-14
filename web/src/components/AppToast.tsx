import * as Portal from "@radix-ui/react-portal";
import * as Toast from "@radix-ui/react-toast";
import clsx from "clsx";
import { Bug, CheckCircle, X } from "phosphor-react";

export interface AppToastProps {
  title?: string;
  description?: string;
  type?: "success" | "error";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AppToast({
  description,
  title,
  type,
  open,
  onOpenChange,
}: AppToastProps) {
  return (
    <Portal.Root>
      <Toast.Provider>
        <Toast.Root
          open={open}
          onOpenChange={onOpenChange}
          className={clsx(
            "absolute right-10 bottom-10 bg-zinc-900 flex flex-col rounded-lg w-96 divide-y",
            {
              "divide-green-600": type === "success",
              "divide-red-600": type === "error",
            }
          )}
        >
          <div className="flex justify-between p-2">
            <Toast.Title className="flex items-center gap-2">
              {type === "success" ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <Bug className="text-red-600" size={20} />
              )}
              <span className="font-semibold text-base">{title}</span>
            </Toast.Title>
            <Toast.Close>
              <X
                className="text-zinc-400 hover:text-zinc-200 bg-zinc-900 rounded-2xl"
                size={24}
                aria-label="fechar"
              />
            </Toast.Close>
          </div>
          <Toast.Description className="p-2 font-normal text-base">
            {description}
          </Toast.Description>
        </Toast.Root>

        <Toast.Viewport />
      </Toast.Provider>
    </Portal.Root>
  );
}
