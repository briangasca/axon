import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRef, forwardRef, useImperativeHandle } from 'react';

function EditorField({ label, content, onUpdate, textClass }) {
    const editor = useEditor({
        extensions: [StarterKit.configure({ bold: false, italic: false, code: false, strike: false, heading: false, bulletList: false, orderedList: false, blockquote: false, codeBlock: false, horizontalRule: false })],
        content: content || '',
        onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
        editorProps: {
            attributes: { class: `outline-none min-h-[3.5rem] ${textClass}` },
        },
    });

    return (
        <div className='flex-1 min-w-0'>
            <p className='text-xs uppercase tracking-widest text-gray-500 mb-1.5'>{label}</p>
            <div className='bg-gray-600 rounded-lg px-3 py-2 text-sm'>
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

const CardEditor = forwardRef(function CardEditor({ card, onSave }, ref) {
    const containerRef = useRef(null);
    const frontHTML = useRef(card.front);
    const backHTML = useRef(card.back);

    useImperativeHandle(ref, () => ({
        save: () => onSave(card.id, frontHTML.current, backHTML.current),
    }));

    const handleBlur = (e) => {
        if (!containerRef.current?.contains(e.relatedTarget)) {
            onSave(card.id, frontHTML.current, backHTML.current);
        }
    };

    return (
        <div
            ref={containerRef}
            onBlur={handleBlur}
            className='flex gap-4 mt-3 pt-3 border-t border-gray-600'
        >
            <EditorField
                label='Front'
                content={card.front}
                onUpdate={html => { frontHTML.current = html; }}
                textClass='text-white'
            />
            <EditorField
                label='Back'
                content={card.back}
                onUpdate={html => { backHTML.current = html; }}
                textClass='text-blue-300'
            />
        </div>
    );
});

export default CardEditor;
