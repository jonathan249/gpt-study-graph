import React from "react";
import { useAuth } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { useZodForm } from "~/hooks";
import { createNotebookSchema, TCreateNotebook } from "~/schema";
import { api } from "~/utils";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Switch,
  Card,
  Badge,
} from "~/components";
import Link from "next/link";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();
  const methods = useZodForm({
    schema: createNotebookSchema,
  });

  const context = api.useUtils();
  const notebookMutation = api.notebook.create.useMutation();

  const { data: notebooks, isLoading } = api.notebook.getNotebooks.useQuery();

  const createNotebook = methods.handleSubmit((data: TCreateNotebook) => {
    notebookMutation.mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          methods.reset({
            isPublic: false,
            title: "",
          });

          context.notebook.getNotebooks.invalidate();
        },
      },
    );
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return <SignInButton />;
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <Card className="p-5">Hello, Mindgraph here...</Card>
      <Card className="p-5">
        <Form {...methods}>
          <form onSubmit={createNotebook} className="space-y-8">
            <FormField
              control={methods.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name your Thought</FormLabel>
                  <FormControl>
                    <Input placeholder="Elephant disaster..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="flex flex-row justify-between">
                    <FormLabel>
                      Thought visability{" "}
                      {methods.getValues("isPublic") ? (
                        <Badge variant={"outline"}>Public</Badge>
                      ) : (
                        <Badge variant={"outline"}>Private</Badge>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>

                  <FormDescription>
                    You can change your thoughts visability at any time.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </Card>
      <div className="flex flex-col gap-1">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          notebooks?.map((notebook) => (
            <Card
              className="flex flex-row items-center justify-between p-5"
              key={notebook.id}
            >
              <div className="flex gap-2">
                {notebook.title}
                <Badge variant={"outline"}>
                  {notebook.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              <Link href={`/graph/${notebook.id}`}>
                <Button>Edit</Button>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
