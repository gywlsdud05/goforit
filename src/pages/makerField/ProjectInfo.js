import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { Controller } from "react-hook-form";

const ProjectInfo = ({ control, register, errors }) => {
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <label htmlFor="mainCategory" className="block mb-2">
          대표 카테고리
        </label>
        <Controller
          name="mainCategory"
          control={control}
          rules={{ required: "대표 카테고리를 선택해주세요" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="category1">카테고리1</SelectItem>
                <SelectItem value="category2">카테고리2</SelectItem>
                <SelectItem value="category3">카테고리3</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.mainCategory && (
          <p className="text-red-500 text-sm">{errors.mainCategory.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="subCategory" className="block mb-2">
          보조 카테고리
        </label>
        <Controller
          name="subCategory"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="subCategory1">서브 카테고리1</SelectItem>
                <SelectItem value="subCategory2">서브 카테고리2</SelectItem>
                <SelectItem value="subCategory3">서브 카테고리3</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="goalAmount" className="block mb-2">
          목표 금액 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            id="goalAmount"
            className="w-full border border-gray-300 rounded-md p-2 pr-8"
            placeholder="목표 금액을 입력해 주세요."
            {...register("goalAmount", {
              required: "목표 금액은 필수입니다.",
              min: { value: 500000, message: "최소 50만원 이상이어야 합니다." },
              max: { value: 100000000, message: "최대 1억원 이하여야 합니다." },
              valueAsNumber: true,
            })}
          />
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            원
          </span>
        </div>
        {errors.goalAmount && (
          <p className="text-red-500 text-sm mt-1">
            {errors.goalAmount.message}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          최소 50만 원 - 최대 1억 원 사이에서 설정해 주세요.
        </p>
      </div>
    </div>
  );
};

export default ProjectInfo;
