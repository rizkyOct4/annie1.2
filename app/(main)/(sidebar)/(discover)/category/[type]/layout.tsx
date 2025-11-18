interface CreatorLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

const layout = ({ children, modal }: CreatorLayoutProps) => {
  return (
    <>
      {children}
      {modal}
    </>
  );
};

export default layout;
