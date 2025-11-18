import CreatorsContext from "./context/context";

const Layout = ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  return (
    <CreatorsContext>
      {children}
      {modal}
    </CreatorsContext>
  );
};

export default Layout;
