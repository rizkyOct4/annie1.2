import CategoryContext from "./provider";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CategoryContext>{children}</CategoryContext>
    </>
  );
};

export default layout;
