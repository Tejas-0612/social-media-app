import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import { SignInValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";

const SignInForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSignIn = async (user: z.infer<typeof SignInValidation>) => {
    try {
      const session = await signInAccount(user);

      if (!session) {
        toast({ title: "Login failed.Please try again" });
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        toast({ title: "LoggedIn Successfully" });

        navigate("/");
      } else {
        toast({ title: "Login failed.Please try again" });
      }
    } catch (error: any) {
      toast({ title: error.response.data.message });
    }
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! Please enter your details.
        </p>
        <form
          onSubmit={form.handleSubmit(onSignIn)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isPending || isUserLoading ? (
              <div className="flex flex-center gap-2">
                <Loader2 />
                Loading...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Don&apos;t have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
