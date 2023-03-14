import { ReactNode } from "react";

export interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <section className="w-full max-w-5xl px-6 flex flex-col gap-16">
        {children}
      </section>
    </main>
  );
}
