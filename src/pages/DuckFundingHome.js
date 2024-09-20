import CategoryComponent from "./CategoryComponent";
import CompanyFooter from "./CompanyFooter";
import Header from "./Header";
import ImageSlider from "./ImageSlider";
import MainProductList from "./MainProductList";
import react from "react";

const DuckFundingHome = () => {
  return (
    <>
      <Header />
      <ImageSlider />
      <CategoryComponent />
      <MainProductList />
      <CompanyFooter />
    </>
  );
};

export default DuckFundingHome;
