import { useMemo } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { OPEN_AI_EDITOR_COMMAND } from "@/components/ai";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/component-picker-plugin";
import { useTranslation } from "@/components/i18n-plugin";
import { Sparkles } from "lucide-react";

export function AiPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "ask-ai",
        label: t.askAi,
        icon: (
          <Sparkles className="text-muted-foreground" />
        ),
        keywords: ["ai", "ask", "assistant", "generate", "write"],
        onSelect: () => {
          editor.dispatchCommand(OPEN_AI_EDITOR_COMMAND, undefined);
        },
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
