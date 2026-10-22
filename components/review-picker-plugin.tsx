import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { INSERT_REVIEW_COMMAND } from "@/components/review";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/component-picker-plugin";
import { useTranslation } from "@/components/i18n-plugin";
import { Star } from "lucide-react";

export function ReviewPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "review",
        label: t.insertReview,
        icon: (
          <Star className="text-muted-foreground" />
        ),
        keywords: ["review", "rating", "stars", "testimonial"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_REVIEW_COMMAND, undefined);
        },
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
