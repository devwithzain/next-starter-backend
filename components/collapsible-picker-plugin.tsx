import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { INSERT_COLLAPSIBLE_COMMAND } from "@/components/collapsible";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/component-picker-plugin";
import { useTranslation } from "@/components/i18n-plugin";
import { ListCollapse } from "lucide-react";

export function CollapsiblePickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "collapsible",
        label: t.insertCollapsible,
        icon: (
          <ListCollapse className="text-muted-foreground" />
        ),
        keywords: ["collapse", "collapsible", "toggle", "details", "accordion"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined);
        },
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
