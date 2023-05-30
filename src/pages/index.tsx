import { type NextPage } from "next";
import Head from "next/head";
import { type RouterOutputs, api } from "~/utils/api";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import { Button } from "~/components/ui/button";
import { Card, CardContent,  } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <Card key={post.id} className="w-[380px]">
      <CardContent className="flex flex-row gap-4 pt-6 items-center">
        <Avatar>
          <AvatarImage src={author?.profileImageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex h-full flex-col">
          <p>
            <small className="text-sm text-muted-foreground">{`@${author.username}`}</small>
            <span className="text-sm text-muted-foreground font-thin">{` • ${dayjs(post.createdAt).fromNow()}`}</span> </p>
          <p className="font-sans capitalize leading-7">{post.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

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
            <Button asChild>
              <SignInButton mode="modal">Sign in</SignInButton>
            </Button>
          )}
        </header>
        <Separator />

        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="m-4 flex flex-col">
            {data?.map((postData) => (
              <PostView {...postData} key={postData.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
