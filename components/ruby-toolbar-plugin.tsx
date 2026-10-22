import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";

import { toggleRubyEditor } from "@/components/ruby";
import { useTranslation } from "@/components/i18n-plugin";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Languages } from "lucide-react";

export function RubyToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();
  const { t } = useTranslation();

  return (
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t.insertRuby}
              disabled={!isEditable}
              onClick={() => {
                toggleRubyEditor(editor);
              }}
            >
              <Languages
              />
            </Button>
          }
        />
        <TooltipContent>{t.insertRuby}</TooltipContent>
      </Tooltip>
    </ButtonGroup>
  );
}
