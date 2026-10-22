import { $getRoot, $getSelection } from "lexical";

import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/extension";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { useTranslation } from "@/components/i18n-plugin";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Minus } from "lucide-react";

export function InsertHorizontalRulePlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={t.insertHorizontalRule}
            disabled={!isEditable}
            onClick={() => {
              editor.update(() => {
                if (!$getSelection()) {
                  $getRoot().selectEnd();
                }
              });
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
            }}
          >
            <Minus
            />
          </Button>
        }
      />
      <TooltipContent>{t.insertHorizontalRule}</TooltipContent>
    </Tooltip>
  );
}
