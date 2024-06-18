import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { MultiSelectInput } from "multi-select-input";

import { PostValidation } from "@/lib/validation";
import {
  useCreatePost,
  useGetAllUsers,
  useUpdatePost,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { IUsers, PostFormProps, SelectOption } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { toast } from "../ui/use-toast";
import FileUploader from "../shared/FileUploader";
import Loader from "../shared/Loader";

const Postform = ({ post, action, group }: PostFormProps) => {
  const { user } = useUserContext();
  const navigate = useNavigate();

  const { data: allUsers } = useGetAllUsers();

  // assigning users for multiselect options
  let options: SelectOption[];

  options = allUsers.data.map((user: IUsers) => ({
    value: user._id,
    label: user.username,
    img: user.avatar?.url,
    subTitle: user.fullname,
  }));

  // states for multiselect
  const [value, setValue] = useState<SelectOption[]>([]);
  const [filteredOptions, setFilteredOptions] =
    useState<SelectOption[]>(options);

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      content: post ? post?.content : "",
      hashtags: post ? post.hashtags?.join(",") : "",
      image: post ? post.imageUrl : "",
    },
  });

  // Query
  const { mutateAsync: createPost, isPending: isPendingCreate } =
    useCreatePost();
  const { mutateAsync: updatePost, isPending: isPendingUpdate } =
    useUpdatePost();

  // Form handler
  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    if (post && action === "update") {
      const updatedPost = await updatePost({
        ...values,
        _id: post._id,
        content: values.content,
        hashtags: values.hashtags.split(","),
        mentions: value.map((user) => user.value),
      });

      if (!updatedPost) {
        toast({
          title: `${action} post failed. Please try again.`,
        });
      }
      return navigate(`/post/${post._id}`);
    }

    const newPost = await createPost({
      content: values.content,
      hashtags: values.hashtags.split(","),
      authorId: user.id,
      image: values.image[0],
      mentions: value.map((user) => user.value),
      groupId: group,
    });

    if (!newPost) {
      toast({
        title: `${action} post failed. Please try again.`,
      });
    } else {
      toast({ title: `Post ${action}ed sucessfully` });
    }
    navigate("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl space-y-8"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
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

        {
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader
                    fieldChange={field.onChange}
                    mediaUrl={post?.imageUrl}
                  />
                </FormControl>
                <FormMessage className="shad-form_message" />
              </FormItem>
            )}
          />
        }

        <FormField
          control={form.control}
          name="hashtags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mentions"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Mentions</FormLabel>
              <FormControl>
                <MultiSelectInput
                  {...field}
                  value={value}
                  setValue={setValue}
                  options={filteredOptions}
                  errorMessage={""}
                  loading={false}
                  onChange={(e) => {
                    setFilteredOptions([...options]);
                    setFilteredOptions((prev) => {
                      return prev?.filter((option) => {
                        return option.label
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase());
                      });
                    });
                  }}
                  className="multi-select"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isPendingCreate || isPendingUpdate}
          >
            {(isPendingCreate || isPendingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Postform;
