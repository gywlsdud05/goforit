import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useForm } from 'react-hook-form';
import { supabase } from '../supabase.client';
import { Alert, AlertDescription, AlertTitle, AlertDialog, AlertDialogAction } from 'components/ui/alert';

const ProductWritePage = () => {
  const editorRef = useRef(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleEditorInit = (evt, editor) => {
    editorRef.current = editor;
  };

  const onSubmit = async (data) => {
    if (editorRef.current) {
      const editorContent = editorRef.current.getContent();
      
      const { error } = await supabase
        .from('products')
        .insert([
          { 
            title: data.title, 
            subtitle: data.subtitle, 
            body: editorContent 
          }
        ]);

      if (error) {
        setError(error.message);
        setSuccess(null);
      } else {
        setError(null);
        setSuccess('Product saved successfully!');
      }
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">상품 등록</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="mb-4">
        <label htmlFor="title" className="block mb-2">제목</label>
        <input
          type="text"
          id="title"
          className="w-full border border-gray-300 rounded-md p-2"
          placeholder="상품 제목을 입력하세요"
          {...register('title', { required: 'Title is required' })}
          />
         {/* {errors.title && <div style={{ color: 'red' }}>{errors.title.message}</div>} */}
         {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
          <label htmlFor="subtitle"className="block mb-1">Subtitle</label>
          <input
            type="text"
            id="subtitle"
            {...register('subtitle')}
            className="w-full p-2 border rounded"
          />
        </div>

      <div className="mb-4">
        <label htmlFor="body" className="block mb-2">내용</label>
        <Editor
          apiKey="no3n9afeejrkw6pxn3qmkyqazn6tbgse29pw1wywfyrxw5qv"
          onInit={handleEditorInit}
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
          }}
          id="body"
          {...register('body', { required: 'Body is required' })}
        />
         {errors.body && <div style={{ color: 'red' }}>{errors.body.message}</div>}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        등록하기
      </button>
      </form>
     {success && (
        <Alert className="mt-4 bg-green-100 border-green-400 text-green-700">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mt-4 bg-red-100 border-red-400 text-red-700">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ProductWritePage;