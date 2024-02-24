"use client";

import { z } from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { CommentValidation } from "@/lib/validations/thread";
import { addCommentToThread } from "@/lib/actions/thread.actions";

/* Emoji */
import { CiFaceSmile } from "react-icons/ci";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

function Comment({
  threadId,
  currentUserImg,
  currentUserId,
}: Props) {
  const pathname = usePathname();
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(
      threadId,
      values.thread,
      JSON.parse(currentUserId),
      pathname
    );

    form.reset();
  };

  const addEmoji = (emoji: any) => {
    // Jika emoji berupa objek, kita ambil `native`-nya untuk mendapatkan teks emoji
    const emojiText = typeof emoji === "object" ? emoji.native : emoji;
    form.setValue("thread", form.getValues("thread") + emojiText);
  };

  return (
    <Form {...form}>
      <form
        className="comment-form relative"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  {...field}
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>

        {showEmojiPicker && (
          <div className="absolute top-[100%] right-2" ref={emojiPickerRef}>
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

        <button
          type="button"
          className="ml-2 focus:outline-none"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <CiFaceSmile className="text-2xl text-gray-400 hover:text-gray-600" />
        </button>
      </form>
    </Form>
  );
}

export default Comment;
