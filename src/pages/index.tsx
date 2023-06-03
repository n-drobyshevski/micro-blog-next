import { type NextPage } from "next";
import Head from "next/head";

import { type RouterOutputs, api } from "~/utils/api";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LoadingPage } from "~/components/loading";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Textarea } from "~/components/ui/textarea";
dayjs.extend(relativeTime);

const FormSchema = z.object({ msg: z.string().nonempty().max(280) });

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
const CreatePost = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={() => {
          return;
        }}
        className="flex w-full flex-col items-end gap-2"
      >
        <FormField
          control={form.control}
          name="msg"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us something"
                  className="w-full resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline" className="w-16">
          Submit
        </Button>
      </form>
    </Form>
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
  const { isLoaded: userLoaded, isSignedIn } = useUser();

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
          {!isSignedIn && (
            <Button asChild>
              <SignInButton mode="modal">Sign in</SignInButton>
            </Button>
          )}
          {isSignedIn && (
            <div className="flex w-full flex-row items-start justify-start gap-4 ">
              <UserButton
                appearance={{
                  elements: {
                    userButtonBox: "w-12 h-12",
                    userButtonTrigger: "w-12 h-12",
                    avatarBox: "w-12 h-12 my-3",
                  },
                }}
              />
              <CreatePost />
            </div>
          )}
        </header>
        <Separator />

        <Feed />
      </main>
    </>
  );
};

export default Home;
