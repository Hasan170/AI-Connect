import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'

interface TipTapEditorProps {
  content: string;
  onUpdate: (html: string) => void;
}

const TipTapEditor = ({ content, onUpdate }: TipTapEditorProps) => {
  const editor = useEditor({
    extensions: [
      Document,
      StarterKit.configure({
        document: false,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML())
    },
  })

  return (
    <EditorContent editor={editor} className="h-full overflow-y-auto p-4" />
  )
}

export default TipTapEditor