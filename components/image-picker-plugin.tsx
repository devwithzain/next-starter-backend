import { useMemo } from "react";

import { useImageFilePicker } from "@/components/insert-image-plugin";
import {
  type ComponentPickerItem,
  useComponentPickerItems,
} from "@/components/component-picker-plugin";
import { useTranslation } from "@/components/i18n-plugin";
import { Image } from "lucide-react";

export function ImagePickerPlugin() {
  const { t } = useTranslation();
  const { pick, input } = useImageFilePicker();

  const items = useMemo<ComponentPickerItem[]>(
    () => [
      {
        value: "image",
        label: t.insertImage,
        icon: (
          <Image className="text-muted-foreground" />
        ),
        keywords: ["image", "photo", "picture", "file", "img"],
        onSelect: pick,
      },
    ],
    [t, pick],
  );

  useComponentPickerItems(items);

  return input;
}
