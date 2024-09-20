import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Home,
  Star,
  Tv,
  Shirt,
  Droplet,
  Sofa,
  Tent,
  Apple,
  Book,
  Play,
  Palette,
  Dog,
  PaintBucket,
  Smile,
  Plane,
  Baby,
  Music,
  Gamepad2,
  MessageCircleMore,
  Car,
  IdCard,
  ChartNetwork,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

const categoryData = [
  { name: "전체", icon: Home, subcategories: [] },
  { name: "BEST 펀딩", icon: Star, subcategories: [] },
  {
    name: "테크·가전",
    icon: Tv,
    subcategories: [
      "생활가전",
      "주방가전",
      "스마트가전",
      "DIY",
      "엔터테인먼트가전",
      "웨어러블",
      "주변기기",
      "App·Web",
    ],
  },
  {
    name: "패션",
    icon: Shirt,
    subcategories: [
      "의류",
      "패션소품",
      "주얼리",
      "가방",
      "신발",
      "아이웨어",
      "언더웨어",
      "럭셔리",
    ],
  },
  {
    name: "뷰티",
    icon: Droplet,
    subcategories: [
      "스킨케어",
      "바디케어",
      "헤어케어",
      "선케어",
      "메이크업",
      "클렌징",
      "향수",
      "비건",
      "구강용품",
      "위생용품",
      "성 웰니스",
      "뷰티서비스",
      "뷰티디바이스",
    ],
  },
  {
    name: "홈·리빙",
    icon: Sofa,
    subcategories: [
      "침실",
      "욕실",
      "주방",
      "청소·세탁",
      "인테리어",
      "DIY",
      "인센스·방향제",
      "화훼·원예",
      "홈케어서비스",
    ],
  },
  {
    name: "스포츠·아웃도어",
    icon: Tent,
    subcategories: [
      "캠핑",
      "골프",
      "자전거",
      "러닝",
      "헬스",
      "홈트레이닝",
      "등산",
      "낚시",
      "스포츠 레슨",
    ],
  },
  {
    name: "푸드",
    icon: Apple,
    subcategories: [
      "산지직송",
      "로컬맛집",
      "해외수입",
      "비건",
      "레스토랑",
      "간편식",
      "헬스·이너뷰티",
      "소스·조미료",
      "디저트·간식",
      "음료·커피",
      "전통주",
    ],
  },
  {
    name: "도서·컨텐츠",
    icon: Book,
    subcategories: [
      "부업·수익",
      "경제·경영",
      "자기계발",
      "외국어",
      "아동",
      "기술·공학",
      "종교",
      "인문·교양",
    ],
  },
  {
    name: "클래스",
    icon: Play,
    subcategories: ["부업·수익", "경제·경영", "자기계발", "입시", "취미"],
  },
  {
    name: "디자인",
    icon: Palette,
    subcategories: ["인테리어", "문구", "그래픽디자인", "공예", "소품", "DIY"],
  },
  { name: "반려동물", icon: Dog, subcategories: ["강아지", "고양이"] },
  { name: "아트", icon: PaintBucket, subcategories: ["그림", "일러스트"] },
  {
    name: "캐릭터·굿즈",
    icon: Smile,
    subcategories: ["TV·영화", "브랜드", "크리에이터"],
  },
  { name: "영화·음악", icon: Music, subcategories: ["음악"] },
  {
    name: "키즈",
    icon: Baby,
    subcategories: ["의류", "출산·육아용품", "액세서리", "장난감", "교구·문구"],
  },
  { name: "게임", icon: Gamepad2, subcategories: ["보드게임", "게임기기"] },
  { name: "만화·웹툰", icon: MessageCircleMore },
  { name: "여행", icon: Plane },
  { name: "자동차", icon: Car },
  { name: "membership", icon: IdCard },
  { name: "소셜", icon: ChartNetwork, subcategories: ["캠페인", "후원"] },
];

const Categories = ({ control, errors }) => {
  const CategorySelector = ({ fieldName, label, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState(null);

    const handleCategoryClick = (category) => {
      if (activeCategory === category) {
        setActiveCategory(null);
      } else {
        setActiveCategory(category);
      }
    };

    const handleSubCategoryClick = (category, subcat) => {
      onChange(`${category.name} > ${subcat}`);
      setIsOpen(false);
      setActiveCategory(null);
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            {value || label}
            <ChevronRight className="h-4 w-4 opacity-50" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{label} 선택</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-4 py-4">
              {categoryData.map((category, index) => (
                <div key={index} className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    {category.name}
                    {activeCategory === category ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                  {activeCategory === category && (
                    <div className="ml-4 space-y-1">
                      {category.subcategories.map((subcat, subIndex) => (
                        <Button
                          key={subIndex}
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() =>
                            handleSubCategoryClick(category, subcat)
                          }
                        >
                          {subcat}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <>
      <div className="mb-4">
        <label htmlFor="mainCategory" className="block mb-2">
          대표 카테고리
        </label>
        <Controller
          name="mainCategory"
          control={control}
          rules={{ required: "대표 카테고리를 선택해주세요" }}
          render={({ field }) => (
            <CategorySelector
              fieldName="mainCategory"
              label="대표 카테고리"
              value={field.value}
              onChange={field.onChange}
            />
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
            <CategorySelector
              fieldName="subCategory"
              label="보조 카테고리"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </div>
    </>
  );
};

export default Categories;
