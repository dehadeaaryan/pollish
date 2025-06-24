"use client";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

import { title, subtitle } from "@/components/primitives";

const api_gateway_url = process.env.NEXT_PUBLIC_API_GATEWAY_URL;
const api_gateway_key = process.env.NEXT_PUBLIC_API_GATEWAY_KEY;

export default function Home() {
  const router = useRouter();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-4 py-8 md:py-10"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({ size: "lg" })}>
          Create visual polls <br /> Share&nbsp;
        </span>
        <span className={title({ color: "yellow", size: "lg" })}>
          instantly&nbsp;
        </span>
      </div>

      <div className="inline-block max-w-xl text-center justify-center">
        <div className={subtitle({ class: "mt-4" })}>Make your own Pollish</div>
      </div>

      <div className="flex gap-3">
        <Form
          className="w-full max-w-s flex flex-row gap-2 items-center justify-center"
          onSubmit={async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.currentTarget));

            try {
              const response = await axios.post(
                `${api_gateway_url}/create`,
                { pollish_name: data.title },
                {
                  headers: {
                    "x-api-key": api_gateway_key!,
                    "Content-Type": "application/json",
                  },
                },
              );

              const id = response.data.pollish_id;

              //   console.log("Created Pollish ID:", id);
              router.push(`/${id}/edit`);
            } catch (err) {
              // console.error("API error:", err);
              if (axios.isAxiosError(err)) {
                alert("Error: " + (err.response?.data?.error || err.message));
              } else {
                alert("Error: " + err);
              }
            }
          }}
        >
          <Input
            fullWidth
            name="title"
            placeholder="Enter Pollish Title"
            size="lg"
            type="text"
            variant="bordered"
          />
          <Button
            className="bg-orange-500 hover:bg-orange-600 opacity-100"
            radius="lg"
            size="lg"
            type="submit"
            variant="shadow"
          >
            Create
          </Button>
        </Form>
      </div>
    </motion.div>
  );
}
