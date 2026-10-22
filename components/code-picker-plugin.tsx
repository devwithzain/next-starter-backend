import { useMemo } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { insertCodeBlock } from "@/components/code";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/component-picker-plugin";
import { useTranslation } from "@/components/i18n-plugin";
import { CodeXml } from "lucide-react";

export function CodePickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "code-block",
        label: t.insertCodeBlock,
        icon: (
          <CodeXml className="text-muted-foreground" />
        ),
        keywords: ["code", "codeblock", "javascript", "python", "js"],
        onSelect: () => insertCodeBlock(editor),
      },
    ],
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
