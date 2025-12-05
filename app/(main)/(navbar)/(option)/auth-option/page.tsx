import ModalAuth from "../@intercept/(.)auth-option/modal";

const page = () => {
  const currentPath = "auth";

  return <ModalAuth currentPath={currentPath} />;
};

export default page;
