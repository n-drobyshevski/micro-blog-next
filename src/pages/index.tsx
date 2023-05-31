import { type NextPage } from "next";
import Head from "next/head";
import { type RouterOutputs, api } from "~/utils/api";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LoadingPage } from "~/components/loading";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <Card key={post.id} className="w-[576px]">
      <CardContent className="flex flex-row items-center gap-4 pt-6">
        <Avatar>
          <AvatarImage src={author?.profileImageUrl} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex h-full flex-col">
          <p>
            <small className="text-sm text-muted-foreground">{`@${author.username}`}</small>
            <span className="text-sm font-thin text-muted-foreground">{` • ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>{" "}
          </p>
          <p className="font-sans capitalize leading-7">{post.content}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="m-4 flex flex-col">
        {[...data]?.map((postData) => (
          <PostView {...postData} key={postData.post.id} />
        ))}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const {isLoaded: userLoaded,isSignedIn,  } = useUser();

  // start fetching posts
  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="micro blog build with t3 stack" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="dark flex min-h-screen flex-col items-center bg-background text-foreground">
        <header className="my-4 flex w-[576px] flex-row justify-end">
          {isSignedIn && <UserButton />}
          {!isSignedIn && (
            <Button asChild>
              <SignInButton mode="modal">Sign in</SignInButton>
            </Button>
          )}
        </header>
        <Separator />

        <Feed />
      </main>
    </>
  );
};

export default Home;
