import Container from "@components/Container";
import Header from "@components/Header";
import SummaryTable, { Summary } from "@components/SummaryTable";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { dehydrate } from "react-query";
import { api } from "../libs/axios";
import { queryClient } from "../libs/queryClient";

export default function Home() {
  return (
    <>
      <Head>
        <title>Habits</title>
        <meta
          name="description"
          content="Organize seus hábitos diários com Habits!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Header />
        <SummaryTable />
      </Container>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  await queryClient.prefetchQuery<Summary[]>(["summary"], async () => {
    const { data } = await api.get<Summary[]>("/summary");
    return data;
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
