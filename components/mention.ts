import { defineExtension } from "lexical";

import { MentionNode } from "@/components/mention-node";

export const MentionExtension = defineExtension({
  name: "@shadcn-editor/editor/Mention",
  nodes: () => [MentionNode],
});
