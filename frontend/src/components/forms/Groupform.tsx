import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { IGroup } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserContext } from "@/context/AuthContext";
import { GroupValidation } from "@/lib/validation";
import {
  useCreateGroup,
  useUpdateGroup,
} from "@/lib/react-query/queriesAndMutations";
import FileUploader from "../shared/FileUploader";
import ProfileUploader from "../shared/ProfileUploader";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Loader from "../shared/Loader";
import { toast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertDialogCancel } from "../ui/alert-dialog";

type GroupFormProps = {
  group?: IGroup;
  action: "create" | "update";
};

const Groupform = ({ group, action }: GroupFormProps) => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const { mutateAsync: createGroup, isPending: isCreating } = useCreateGroup();
  const { mutateAsync: updateGroup, isPending: isUpdating } = useUpdateGroup();

  const form = useForm<z.infer<typeof GroupValidation>>({
    resolver: zodResolver(GroupValidation),
    defaultValues: {
      name: group ? group.name : "",
      description: group ? group.description : "",
      avatar: group ? group.avatar.url : "",
      coverImage: group ? group.coverImage.url : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof GroupValidation>) => {
    if (group && action == "update") {
      const updatedGroup = await updateGroup({
        _id: group._id,
        name: values.name,
        description: values.description,
        avatar: values.avatar[0],
        coverImage: values.coverImage[0],
        admin: user.id,
      });

      if (!updatedGroup) {
        toast({
          title: `${action} Group failed. Please try again.`,
        });
      } else {
        toast({ title: `Group ${action}d sucessfully` });
      }

      navigate(`/group/${group._id}`);
    } else {
      const newGroup = await createGroup({
        name: values.name,
        description: values.description,
        avatar: values.avatar[0],
        coverImage: values.coverImage[0],
        admin: user.id,
      });

      if (!newGroup) {
        toast({
          title: `${action} Group failed. Please try again.`,
        });
      } else {
        toast({ title: `Group ${action}d sucessfully` });
      }

      navigate(`/group/${newGroup.data._id}`);
    }
    return;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl space-y-8"
      >
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={group?.coverImage.url}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ProfileUploader
                  fieldChange={field.onChange}
                  mediaUrl={group?.avatar.url!}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Description</FormLabel>
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
            className="shad-button_primary whitespace-nowrap"
            disabled={isCreating || isUpdating}
          >
            {(isCreating || isUpdating) && <Loader />}
            {action} Group
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </div>
      </form>
    </Form>
  );
};

export default Groupform;
