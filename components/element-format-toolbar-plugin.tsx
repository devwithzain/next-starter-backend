import type { ReactNode } from "react";

import { type ElementFormatType, FORMAT_ELEMENT_COMMAND } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { useFormatStateValue } from "@/components/format-state";
import type { Locale } from "@/components/locales";
import { useTranslation } from "@/components/i18n-plugin";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, PilcrowRight, PilcrowLeft } from "lucide-react";

type AlignItem = {
  value: Exclude<ElementFormatType, "">;
  labelKey: keyof Locale;
  icon: ReactNode;
};

function AlignToggleGroup({ items }: { items: AlignItem[] }) {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const elementFormat = useFormatStateValue("elementFormat");
  const isEditable = useLexicalEditable();
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      spacing={0}
      disabled={!isEditable}
      value={[elementFormat]}
      onValueChange={(value) => {
        const next = value[0] as Exclude<ElementFormatType, ""> | undefined;
        if (next) {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, next);
        }
      }}
    >
      {items.map(({ value, labelKey, icon }) => (
        <Tooltip key={value}>
          <TooltipTrigger
            render={
              <ToggleGroupItem value={value} aria-label={t[labelKey]}>
                {icon}
              </ToggleGroupItem>
            }
          />
          <TooltipContent>{t[labelKey]}</TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}

export function ElementFormatToolbarPlugin({
  formats = "all",
}: {
  formats?: "basic" | "all";
}) {
  const { dir } = useTranslation();
  const isRtl = dir === "rtl";

  const alignGroups: AlignItem[][] = [
    [
      {
        value: "left",
        icon: (
          <AlignLeft
          />
        ),
        labelKey: "alignLeft",
      },
      {
        value: "center",
        icon: (
          <AlignCenter
          />
        ),
        labelKey: "alignCenter",
      },
      {
        value: "right",
        icon: (
          <AlignRight
          />
        ),
        labelKey: "alignRight",
      },
      {
        value: "justify",
        icon: (
          <AlignJustify
          />
        ),
        labelKey: "alignJustify",
      },
    ],
    [
      {
        value: "start",
        icon: isRtl ? (
          <PilcrowRight
          />
        ) : (
          <PilcrowLeft
          />
        ),
        labelKey: "alignStart",
      },
      {
        value: "end",
        icon: isRtl ? (
          <PilcrowLeft
          />
        ) : (
          <PilcrowRight
          />
        ),
        labelKey: "alignEnd",
      },
    ],
  ];

  const groups = formats === "basic" ? alignGroups.slice(0, 1) : alignGroups;

  return (
    <>
      {groups.map((items, groupIndex) => (
        <AlignToggleGroup key={groupIndex} items={items} />
      ))}
    </>
  );
}
