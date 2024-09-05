import { Editor } from "@tinymce/tinymce-react";
import React from "react";
import { Controller } from "react-hook-form";

const ProductStory = ({ control, errors }) => {
  return (
    <div className="mb-4">
      <label htmlFor="body" className="block mb-2">
        내용
      </label>
      <Controller
        name="body"
        control={control}
        rules={{ required: "내용을 입력해주세요" }}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey="no3n9afeejrkw6pxn3qmkyqazn6tbgse29pw1wywfyrxw5qv"
            value={value}
            onEditorChange={onChange}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        )}
      />
      {errors.body && (
        <p className="text-red-500 text-sm">{errors.body.message}</p>
      )}
    </div>
  );
};

export default ProductStory;
