import { type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import { Button } from "~/components/ui/button";
import { Card, CardHeader } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

const Home: NextPage = () => {
  const { data } = api.posts.getAll.useQuery();
  console.log(data);
  const user = useUser();
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="micro blog build with t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="dark flex min-h-screen flex-col items-center bg-background text-foreground">
        <header className="my-4 flex w-[380px] flex-row justify-end">
          {!!user.isSignedIn && <UserButton />}
          {!user.isSignedIn && (
            <Button asChild >
              <SignInButton mode="modal">Sign in</SignInButton>
            </Button>
          )}
        </header>
        <Separator />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="m-4 flex flex-col">
            {data?.map((post) => (
              <Card key={post.id} className="w-[380px]">
                <CardHeader>
                  <p className="font-sans capitalize leading-7 [&:not(:first-child)]:mt-6">
                    {post.content}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
