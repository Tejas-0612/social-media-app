import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "@/components/shared/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ProfileValidation } from "@/lib/validation";
import { useUserContext } from "@/context/AuthContext";
import ProfileUploader from "@/components/shared/ProfileUploader";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useGetUserById,
  useUpdateUserAvatar,
  useUpdateUserInfo,
} from "@/lib/react-query/queriesAndMutations";

const UpdateProfile = () => {
  const navigate = useNavigate();

  const { userId } = useParams();
  const { user, setUser } = useUserContext();

  const { data: currentUser } = useGetUserById(userId!);

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  // Queries
  const { mutateAsync: updateUser, isPending: isUserPending } =
    useUpdateUserInfo();
  const { mutateAsync: updateAvatar, isPending: isAvatarPending } =
    useUpdateUserAvatar();

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: currentUser.bio,
      imageUrl: user.imageUrl,
      fullname: user.fullname,
    },
  });

  const onSubmit = async (values: z.infer<typeof ProfileValidation>) => {
    if (values.imageUrl !== user.imageUrl) {
      await updateAvatar(values.imageUrl[0]);
    }

    const updatedUser = await updateUser({
      fullname: values.fullname,
      bio: values.bio,
    });

    if (!updatedUser) {
      toast({
        title: `Update user failed. Please try again.`,
        variant: "destructive",
      });
    }

    setUser({
      ...user,
      fullname: updatedUser?.data.fullname,
      bio: updatedUser?.data.bio,
      imageUrl: updatedUser?.data.avatar.url,
    });

    return navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start gap-3 justify-start w-full max-w-5xl">
          <img
            src="/assets/icons/edit.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Profile</h2>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log(errors);
            })}
            className="flex flex-col gap-7 w-full mt-4 max-w-5xl"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              defaultValue={currentUser.avatar.url}
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser.avatar.url}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Name</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Username</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="shad-input"
                      {...field}
                      disabled
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="shad-form_label">Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      className="shad-textarea custom-scrollbar"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />
            <div className="flex gap-4 items-center justify-end">
              <Button
                type="submit"
                className="shad-button_dark_4"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>{" "}
              <Button
                type="submit"
                className="shad-button_primary whitespace-nowrap"
                disabled={isUserPending || isAvatarPending}
              >
                {(isUserPending || isAvatarPending) && <Loader />}
                Update Profile
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UpdateProfile;
