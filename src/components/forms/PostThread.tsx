"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { ThreadValidation } from "@/lib/validations/thread";
import { createThread, editThread } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions"; /* New */

/* Emoji */
import { CiFaceSmile } from "react-icons/ci";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useState, useEffect, useRef } from "react";

interface Props {
  userId: string;
  threadId?: string;
  threadText?: string;
}

function PostThread({ userId, threadId, threadText }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event: { target: any }) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: threadText || "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setIsButtonDisabled(true);

    if (threadId && threadText) {
      await editThread({
        threadId,
        text: values.thread,
        path: pathname,
      });
    } else {
      await createThread({
        text: values.thread,
        author: userId,
        communityId: organization ? organization.id : null,
        path: pathname,
      });
    }

    router.push("/");
  };

  const addEmoji = (e: { unified: string }) => {
    const sym = e.unified.split("_");
    const codeArray: number[] = sym.map((el) => parseInt(el, 16));
    let emoji = String.fromCodePoint(...codeArray);
    form.setValue("thread", form.getValues("thread") + emoji);
  };

  return (
    <Form {...form}>
      <form
        className="mt-5 flex flex-col justify-start gap-10 rounded-lg border border-dark-4 px-7 py-4" // Menggunakan border-dark-4 untuk warna border yang sesuai
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <div className="w-full flex items-end relative rounded-lg py-3 px-3 bg-dark-3 text-light-1"> {/* Menggunakan bg-dark-3 untuk warna latar belakang yang sesuai */}
                <FormControl className="no-focus border-none bg-transparent text-dark-1">
                  <Textarea
                    {...field}
                    rows={8}
                    className="resize-none scrollbar-thin scrollbar-thumb-primary-50 text-white" // Tambahkan kelas text-white di sini
                    placeholder={`Share your thoughts...`}
                  />
                </FormControl>
                <span
                  className="pl-2 cursor-pointer hover:text-primary-500"
                  onClick={() => setShowEmoji(!showEmoji)}
                >
                  <CiFaceSmile />
                </span>

                {showEmoji && (
                  <div
                    className="absolute top-[100%] right-2"
                    ref={emojiPickerRef}
                  >
                    <Picker
                      data={data}
                      emojiSize={20}
                      emojiButtonSize={28}
                      onEmojiSelect={addEmoji}
                      maxFrequentRows={0}
                      theme="light"
                    />
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-primary-500 hover:bg-secondary-500"
          disabled={isButtonDisabled}
        >
          {isButtonDisabled ? (
            <>{threadId ? "Editing" : "Creating"} Thread...</>
          ) : (
            <>{threadId ? "Edit" : "Create"} Thread</>
          )}
        </Button>
      </form>
    </Form>
  );
}

export default PostThread;
