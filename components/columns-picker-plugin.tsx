import { type ReactNode, useMemo } from "react";

import { $getRoot, $getSelection } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { INSERT_LAYOUT_COMMAND } from "@/components/layout";
import type { Locale } from "@/components/locales";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/component-picker-plugin";
import { useTranslation } from "@/components/i18n-plugin";
import { RectangleVertical, Columns2, Columns3 } from "lucide-react";

const COLUMN_ITEMS: {
  value: string;
  labelKey: keyof Locale;
  icon: ReactNode;
  templateColumns: string;
}[] = [
  {
    value: "columns-one",
    labelKey: "columnsOne",
    icon: (
      <RectangleVertical className="text-muted-foreground" />
    ),
    templateColumns: "1fr",
  },
  {
    value: "columns-two",
    labelKey: "columnsTwo",
    icon: (
      <Columns2 className="text-muted-foreground" />
    ),
    templateColumns: "1fr 1fr",
  },
  {
    value: "columns-three",
    labelKey: "columnsThree",
    icon: (
      <Columns3 className="text-muted-foreground" />
    ),
    templateColumns: "1fr 1fr 1fr",
  },
];

export function ColumnsPickerPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();

  const items = useMemo<ComponentPickerItem[]>(
    () =>
      COLUMN_ITEMS.map(({ value, labelKey, icon, templateColumns }) => ({
        value,
        label: t[labelKey],
        icon,
        keywords: ["columns", "layout", "grid"],
        onSelect: () => {
          editor.update(() => {
            if (!$getSelection()) {
              $getRoot().selectEnd();
            }
          });
          editor.dispatchCommand(INSERT_LAYOUT_COMMAND, templateColumns);
        },
      })),
    [editor, t],
  );

  useComponentPickerItems(items);

  return null;
}
