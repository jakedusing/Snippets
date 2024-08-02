"use server";

import { redirect } from "next/navigation";
import { db } from "@/db";

export async function editSnippet(id: number, code: string) {
  await db.snippet.update({
    where: { id },
    data: { code },
  });

  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippet.delete({
    where: { id },
  });

  redirect("/");
}

export async function createSnippet(
  formState: { message: string },
  formData: FormData
) {
  try {
    // check the user's inputs and make sure they're valid
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 3) {
      return {
        message: "Title must be longer",
      };
    }
    if (typeof code !== "string" || code.length < 10) {
      return {
        message: "Code must be longer",
      };
    }

    // create a new record in the db
    await db.snippet.create({
      data: {
        title: title,
        code: code,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        mesage: err.message,
      };
    } else {
      return {
        message: "Something went wrong..",
      };
    }
  }

  // redirect the user back to the root route
  redirect("/");
}
