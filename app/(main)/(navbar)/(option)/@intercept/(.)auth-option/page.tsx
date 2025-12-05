import ModalAuth from "./modal";

const page = async () => {
  const currentPath = "auth";

  return <ModalAuth currentPath={currentPath} />;
};
export default page;
