import * as z from "zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { INewStory } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StoryValidation } from "@/lib/validation";
import { useCreateStory } from "@/lib/react-query/queriesAndMutations";
import FileUploader from "../shared/FileUploader";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Loader from "../shared/Loader";
import { toast } from "../ui/use-toast";
import { AlertDialogCancel } from "../ui/alert-dialog";

type GroupFormProps = {
  story?: INewStory;
  action: "create" | "update";
  closeDialog: () => void;
};

const Storyform = ({ closeDialog, story, action }: GroupFormProps) => {
  const navigate = useNavigate();
  const { mutateAsync: createStory, isPending: isCreating } = useCreateStory();

  const form = useForm<z.infer<typeof StoryValidation>>({
    resolver: zodResolver(StoryValidation),
    defaultValues: {
      media: story ? story.media : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof StoryValidation>) => {
    const newStory = await createStory({
      media: values.media,
    });

    if (!newStory) {
      toast({
        title: `${action} Story failed. Please try again.`,
        variant: "destructive",
      });
    } else {
      toast({ title: `Story Created sucessfully.` });
    }

    closeDialog();
    navigate(`/`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl space-y-4"
      >
        <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={story?.media}
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
            disabled={isCreating}
          >
            {isCreating && <Loader />}
            {action} Story
          </Button>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </div>
      </form>
    </Form>
  );
};

export default Storyform;
