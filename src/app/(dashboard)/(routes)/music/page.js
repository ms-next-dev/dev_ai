"use client";
import { Empty } from "@/components/empty";
import Heading from "@/components/heading";
import { Loader } from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Music } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { formSchema } from "./constants";

const MusicPage = () => {
    const router = useRouter();
    const [music, setMusic] = useState();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const onSubmit = async (values) => {
        try {
            setMusic(undefined);

            const response = await axios.post("/api/music", values);
            console.log(response);

            setMusic(response.data.audio);
            form.reset();
        } catch (error) {
            if (error?.response?.status === 403) {
                // proModal.onOpen();
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            router.refresh();
        }
    };

    const isLoading = form.formState.isSubmitting;
    return (
        <div>
            <Heading
                title="Music Generation"
                description="Turn your prompt into music."
                Icon={Music}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="
              rounded-lg 
              border 
              w-full 
              p-4 
              px-3 
              md:px-6 
              focus-within:shadow-sm
              grid
              grid-cols-12
              gap-2
            "
                    >
                        <FormField
                            name="prompt"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl className="m-0 p-0">
                                        <Input
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="Piano solo"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            className="col-span-12 lg:col-span-2 w-full"
                            type="submit"
                            disabled={isLoading}
                            size="icon"
                        >
                            Generate
                        </Button>
                    </form>
                </Form>
                {isLoading && (
                    <div className="p-20">
                        <Loader />
                    </div>
                )}
                {!music && !isLoading && <Empty label="No music generated." />}
                {music && (
                    <audio controls className="w-full mt-8">
                        <source src={music} />
                    </audio>
                )}
            </div>
        </div>
    );
};

export default MusicPage;
