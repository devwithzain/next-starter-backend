import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { insertCodeBlock } from "@/components/code";
import { useTranslation } from "@/components/i18n-plugin";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CodeXml } from "lucide-react";

export function InsertCodeBlockPlugin() {
  const [editor] = useLexicalComposerContext();
  const { t } = useTranslation();
  const isEditable = useLexicalEditable();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t.insertCodeBlock}
            disabled={!isEditable}
            onClick={() => insertCodeBlock(editor)}
          >
            <CodeXml
            />
          </Button>
        }
      />
      <TooltipContent>{t.insertCodeBlock}</TooltipContent>
    </Tooltip>
  );
}
