import { useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { INSERT_CARD_COMMAND } from "@/components/card";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/component-picker-plugin";
import { useTranslation } from "@/components/i18n-plugin";
import { LayoutPanelTop } from "lucide-react";

export function CardPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "card",
        label: t.insertCard,
        icon: (
          <LayoutPanelTop className="text-muted-foreground" />
        ),
        keywords: ["card", "panel", "container", "box"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_CARD_COMMAND, undefined);
        },
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
