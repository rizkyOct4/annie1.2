import CreatorContext from "./data/context";

const layout = ({
  children,
  intercept,
  dashboard,
  content,
  list,
}: {
  children: React.ReactNode;
  intercept: React.ReactNode;
  dashboard: React.ReactNode;
  content: React.ReactNode;
  list: React.ReactNode;
}) => {
  return (
    <CreatorContext>
      <main className="w-full">
        {children}
        {intercept}
        <section>{dashboard}</section>
        <section className="flex w-full">
          <div className="w-[15%] h-auto">{list}</div>
          <div className="w-[85%]">{content}</div>
        </section>
      </main>
    </CreatorContext>
  );
};

export default layout;
