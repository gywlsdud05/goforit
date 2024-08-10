import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const ProductWritePage = () => {
  const editorRef = useRef(null);

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  const handleSubmit = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div>
  <div className="p-4 bg-gray-200">첫 번째 요소</div>
  <div className="p-4 bg-gray-300">두 번째 요소</div>
  <div className="p-4 bg-gray-400">세 번째 요소</div>
</div>

  );
};

export default ProductWritePage;