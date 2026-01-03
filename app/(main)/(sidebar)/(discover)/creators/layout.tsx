import CreatorsContext from "./context/context";

const Layout = ({
  modal,
  creators,
}: {
  modal: React.ReactNode;
  creators: React.ReactNode;
}) => {
  return (
    <CreatorsContext>
      {modal}
      {creators}
    </CreatorsContext>
  );
};

export default Layout;
