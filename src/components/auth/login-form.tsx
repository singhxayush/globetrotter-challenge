"use client";

import {CardWrapper} from "./card-wrapper";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {loginSchema} from "@/app/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {FormSuccess} from "../ui/form-success";
import {login} from "@/actions/login";
import {useState, useTransition} from "react";

export const LoginForm = () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [success, setSuccess] = useState<string | undefined>("");

  const [isLoginPending, startLoginTransition] = useTransition(); // {note}

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setSuccess("");
    // console.log(values); {warn} Don't leave it commented. Only for Development
    startLoginTransition(() => {
      login(values).then((data) => {
        setSuccess(data?.success ?? "");
      });
    });
  };

  return (
    <CardWrapper headerLabel="Welcome Back" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      kind="email"
                      disabled={isLoginPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="font-bold">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="•••••••••••••"
                      type="password"
                      kind="password"
                      disabled={isLoginPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isLoginPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
