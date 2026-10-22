import {
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	defineExtension,
} from "lexical";
import {
	ClearEditorExtension,
	HorizontalRuleExtension,
	TabIndentationExtension,
} from "@lexical/extension";
import {
	$createListItemNode,
	$createListNode,
	CheckListExtension,
	ListExtension,
} from "@lexical/list";
import {
	CHECK_LIST,
	ELEMENT_TRANSFORMERS,
	MULTILINE_ELEMENT_TRANSFORMERS,
	registerMarkdownShortcuts,
	TEXT_FORMAT_TRANSFORMERS,
	TEXT_MATCH_TRANSFORMERS,
	$convertFromMarkdownString,
	$convertToMarkdownString,
	type Transformer,
} from "@lexical/markdown";
import {
	useLanguage,
	LanguageProvider,
	LanguageSelectorPlugin,
} from "@/components/i18n-plugin";
import {
	$createHeadingNode,
	$createQuoteNode,
	RichTextExtension,
} from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";
import { cn } from "@/lib/utils";
import { useMemo, useRef } from "react";
import { HistoryExtension } from "@lexical/history";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoLinkExtension } from "@/components/auto-link";
import { AutocompleteExtension } from "@/components/autocomplete";
import { CardExtension } from "@/components/card";
import { CodeExtension } from "@/components/code";
import { CollapsibleExtension } from "@/components/collapsible";
import { DateTimeExtension } from "@/components/datetime";
import { DragDropPasteExtension } from "@/components/drag-drop-paste";
import { EquationExtension } from "@/components/equation";
import { FigmaExtension } from "@/components/figma";
import { FormatStateExtension } from "@/components/format-state";
import { ImageExtension } from "@/components/image";
import { LayoutExtension } from "@/components/layout";
import { LinkExtension } from "@/components/link";
import { MentionExtension } from "@/components/mention";
import { PollExtension } from "@/components/poll";
import { PullQuoteExtension } from "@/components/pullquote";
import { RubyExtension } from "@/components/ruby";
import { ShortcutsExtension } from "@/components/shortcuts";
import { SpecialTextExtension } from "@/components/special-text";
import { SpeechToTextExtension } from "@/components/speech-to-text";
import { TabFocusExtension } from "@/components/tab-focus";
import { TwitterExtension } from "@/components/twitter";
import { YouTubeExtension } from "@/components/youtube";
import { ActivityBar } from "@/components/activitybar-plugin";
import { CountPlugin } from "@/components/count-plugin";
import { ReadOnlyTogglePlugin } from "@/components/read-only-toggle-plugin";
import { ShortcutPlugin } from "@/components/shortcut-plugin";
import { SpeechToTextPlugin } from "@/components/speech-to-text-plugin";
import { AutoEmbedPlugin } from "@/components/auto-embed-plugin";
import { BlockInsert } from "@/components/block-insert-plugin";
import { InsertCodeBlockPlugin } from "@/components/insert-code-block-plugin";
import { InsertColumnsPlugin } from "@/components/insert-columns-plugin";
import { InsertEquationPlugin } from "@/components/insert-equation-plugin";
import { InsertHorizontalRulePlugin } from "@/components/insert-horizontal-rule-plugin";
import { InsertImagePlugin } from "@/components/insert-image-plugin";
import { InsertTablePlugin } from "@/components/insert-table-plugin";
import { BulletedListPickerPlugin } from "@/components/bulleted-list-picker-plugin";
import { CardPickerPlugin } from "@/components/card-picker-plugin";
import { CheckListPickerPlugin } from "@/components/check-list-picker-plugin";
import { CodePickerPlugin } from "@/components/code-picker-plugin";
import { CollapsiblePickerPlugin } from "@/components/collapsible-picker-plugin";
import { ColumnsPickerPlugin } from "@/components/columns-picker-plugin";
import { ComponentPicker } from "@/components/component-picker-plugin";
import { DateTimePickerPlugin } from "@/components/datetime-picker-plugin";
import { DividerPickerPlugin } from "@/components/divider-picker-plugin";
import { HeadingPickerPlugin } from "@/components/heading-picker-plugin";
import { ImagePickerPlugin } from "@/components/image-picker-plugin";
import { NumberedListPickerPlugin } from "@/components/numbered-list-picker-plugin";
import { ParagraphPickerPlugin } from "@/components/paragraph-picker-plugin";
import { PollPickerPlugin } from "@/components/poll-picker-plugin";
import { PullQuotePickerPlugin } from "@/components/pullquote-picker-plugin";
import { QuotePickerPlugin } from "@/components/quote-picker-plugin";
import { ReviewPickerPlugin } from "@/components/review-picker-plugin";
import { TablePickerPlugin } from "@/components/table-picker-plugin";
import { ContentEditable } from "@/components/content-editable";
import { ContextMenuPlugin } from "@/components/context-menu-plugin";
import { DraggableBlockPlugin } from "@/components/draggable-block-plugin";
import { ReactFindReplaceExtension } from "@/components/find-replace-panel";
import { FloatingToolbarPlugin } from "@/components/floating-toolbar-plugin";
import { LinkEditorPlugin } from "@/components/link-editor-plugin";
import { ReactReviewExtension } from "@/components/review-plugin";
import { RubyEditorPlugin } from "@/components/ruby-editor-plugin";
import { TableHoverActionsPlugin } from "@/components/table-hover-actions-plugin";
import { MentionPlugin } from "@/components/mention-plugin";
import { BlockFormatToolbarPlugin } from "@/components/block-format-toolbar-plugin";
import { ClearToolbarPlugin } from "@/components/clear-toolbar-plugin";
import { ColorToolbarPlugin } from "@/components/color-toolbar-plugin";
import { ElementFormatToolbarPlugin } from "@/components/element-format-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/font-family-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/font-size-toolbar-plugin";
import { HistoryToolbarPlugin } from "@/components/history-toolbar-plugin";
import { ImportExportToolbarPlugin } from "@/components/import-export-toolbar-plugin";
import { IndentToolbarPlugin } from "@/components/indent-toolbar-plugin";
import { LinkToolbarPlugin } from "@/components/link-toolbar-plugin";
import { RubyToolbarPlugin } from "@/components/ruby-toolbar-plugin";
import { TextFormatToolbarPlugin } from "@/components/text-format-toolbar-plugin";
import { Toolbar } from "@/components/toolbar-plugin";
import { editorTheme } from "@/components/theme";
import { HR } from "@/components/horizontal-rule-transformer";
import { IMAGE } from "@/components/image-transformer";
import { TABLE } from "@/components/table-transformer";
import { DirectionProvider } from "@base-ui/react";

const EDITOR_TRANSFORMERS: Transformer[] = [
	TABLE,
	HR,
	IMAGE,
	CHECK_LIST,
	...ELEMENT_TRANSFORMERS,
	...MULTILINE_ELEMENT_TRANSFORMERS,
	...TEXT_FORMAT_TRANSFORMERS,
	...TEXT_MATCH_TRANSFORMERS,
];

export interface EditorXProps {
	initialContent?: string;
	onChange?: (content: string) => void;
	className?: string;
}

export function EditorX({
	initialContent,
	onChange,
	className,
}: EditorXProps = {}) {
	const initialContentRef = useRef(initialContent);
	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	const app = useMemo(
		() =>
			defineExtension({
				name: "@shadcn-editor/editor",
				namespace: "shadcn-editor",
				dependencies: [
					RichTextExtension,
					HistoryExtension,
					TabIndentationExtension,
					ListExtension,
					CheckListExtension,
					LinkExtension,
					AutoLinkExtension,
					CodeExtension,
					LayoutExtension,
					EquationExtension,
					TableExtension,
					HorizontalRuleExtension,
					ImageExtension,
					MentionExtension,
					SpecialTextExtension,
					AutocompleteExtension,
					DragDropPasteExtension,
					TabFocusExtension,
					SpeechToTextExtension,
					ShortcutsExtension,
					CardExtension,
					CollapsibleExtension,
					DateTimeExtension,
					PullQuoteExtension,
					ReactReviewExtension,
					PollExtension,
					RubyExtension,
					YouTubeExtension,
					TwitterExtension,
					FigmaExtension,
					FormatStateExtension,
					ReactFindReplaceExtension,
					ClearEditorExtension,
				],
				$initialEditorState: () => {
					const init = initialContentRef.current;
					if (init && init.trim()) {
						$convertFromMarkdownString(init, EDITOR_TRANSFORMERS);
					} else {
						$getRoot().append(
							$createHeadingNode("h1").append($createTextNode("Blog Heading")),
							$createParagraphNode().append(
								$createTextNode(
									"Start typing your article here or type '/' for blocks...",
								),
							),
						);
					}
				},
				register: (editor) =>
					registerMarkdownShortcuts(editor, EDITOR_TRANSFORMERS),
				theme: editorTheme,
			}),
		[],
	);

	return (
		<LanguageProvider>
			<LexicalExtensionComposer
				extension={app}
				contentEditable={null}>
				<OnChangePlugin
					onChange={(editorState) => {
						editorState.read(() => {
							const markdown = $convertToMarkdownString(EDITOR_TRANSFORMERS);
							onChangeRef.current?.(markdown);
						});
					}}
				/>
				<EditorWrapper className={className}>
					<Toolbar>
						<HistoryToolbarPlugin />
						<BlockFormatToolbarPlugin />
						<FontFamilyToolbarPlugin />
						<FontSizeToolbarPlugin />
						<ColorToolbarPlugin />
						<TextFormatToolbarPlugin formats="basic" />
						<ElementFormatToolbarPlugin formats="basic" />
						<IndentToolbarPlugin />
						<BlockInsert>
							<InsertCodeBlockPlugin />
							<InsertColumnsPlugin />
							<InsertEquationPlugin />
							<InsertHorizontalRulePlugin />
							<InsertImagePlugin />
							<InsertTablePlugin />
						</BlockInsert>
						<ClearToolbarPlugin />
						<ImportExportToolbarPlugin transformers={EDITOR_TRANSFORMERS} />
					</Toolbar>
					<div className="relative min-w-0 flex-1 overflow-y-auto">
						<ContentEditable variant="draggable" />
						<DraggableBlockPlugin />
						<FloatingToolbarPlugin>
							<LinkToolbarPlugin />
							<RubyToolbarPlugin />
						</FloatingToolbarPlugin>
						<LinkEditorPlugin />
						<RubyEditorPlugin />
						<TableHoverActionsPlugin />
						<MentionPlugin />
						<AutoEmbedPlugin />
						<ContextMenuPlugin />
						<ComponentPicker>
							<ParagraphPickerPlugin />
							<HeadingPickerPlugin />
							<TablePickerPlugin />
							<NumberedListPickerPlugin />
							<BulletedListPickerPlugin />
							<CheckListPickerPlugin />
							<QuotePickerPlugin />
							<CodePickerPlugin />
							<DividerPickerPlugin />
							<ColumnsPickerPlugin />
							<ImagePickerPlugin />
							<CardPickerPlugin />
							<CollapsiblePickerPlugin />
							<DateTimePickerPlugin />
							<PullQuotePickerPlugin />
							<ReviewPickerPlugin />
							<PollPickerPlugin />
						</ComponentPicker>
					</div>
					<ActivityBar>
						<div className="flex items-center gap-3">
							<CountPlugin />
						</div>
						<div className="ms-auto flex items-center gap-3">
							<SpeechToTextPlugin />
							<ReadOnlyTogglePlugin />
							<ShortcutPlugin />
							<LanguageSelectorPlugin />
						</div>
					</ActivityBar>
				</EditorWrapper>
			</LexicalExtensionComposer>
		</LanguageProvider>
	);
}

function EditorWrapper({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	const { language, dir } = useLanguage();
	return (
		<DirectionProvider direction={dir}>
			<div
				dir={dir}
				lang={language}
				className={cn(
					"relative flex min-h-[400px] w-full flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30",
					className,
				)}>
				{children}
			</div>
		</DirectionProvider>
	);
}
