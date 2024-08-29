import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../supabase.client';
import { Alert, AlertDescription, AlertTitle, AlertDialog, AlertDialogAction } from '@/components/ui/alert';

const ProductWritePage = () => {

    //const editorRef = useRef(null);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const { control, register, handleSubmit, watch, formState: { errors } } = useForm();

    //   const handleEditorInit = (evt, editor) => {
    //     editorRef.current = editor;
    //   };

    const maxLength = 40;
    const titleValue = watch('title') || '';

    const onSubmit = async (data) => {
        // if (editorRef.current) {
        //   const editorContent = editorRef.current.getContent();

        const { error } = await supabase
            .from('products')
            .insert([
                {
                    title: data.title,
                    summary: data.summary,
                    // body: editorContent 
                    body: data.body,
                    price: data.price
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
                        {...register('title', {
                            required: 'Title is required',
                            maxLength: {
                                value: maxLength,
                                message: `Title should be at most ${maxLength} characters`
                            }
                        })}
                    />
                    <span className="text-sm text-gray-500">
                        {maxLength - titleValue.length}자 남음
                    </span>
                    {/* {errors.title && <div style={{ color: 'red' }}>{errors.title.message}</div>} */}
                    {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                </div>

                <div>
                    <label htmlFor="summary" className="block mb-1">Summary</label>
                    <input
                        type="text"
                        id="summary"
                        {...register('summary')}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="body" className="block mb-2">내용</label>

                    <Controller
                        name="body"
                        control={control}
                        rules={{ required: 'Body is required' }}
                        render={({ field: { onChange, value, onBlur, ref } }) => (


                            <Editor
                                apiKey="no3n9afeejrkw6pxn3qmkyqazn6tbgse29pw1wywfyrxw5qv"

                                //   onInit={handleEditorInit}

                                value={value}
                                onEditorChange={onChange}


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
                            //onEditorChange={(content, editor) => onChange(content)}
                            //   id="body"
                            // {...register('body', { required: 'Body is required' })}
                            />
                        )}
                    />
                    {errors.body && <p className="text-red-500 text-sm">{errors.body.message}</p>}

                </div>

                <div className="mb-4">
                    <label htmlFor="price" className="block mb-2">가격</label>
                    <input
                        type="number"
                        id="price"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="상품 가격을 입력하세요"
                        {...register('price', { required: '가격은 필수입니다.', valueAsNumber: true })}
                    />
                    {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>


                <button
                    // onClick={handleSubmit}
                    type="submit"
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