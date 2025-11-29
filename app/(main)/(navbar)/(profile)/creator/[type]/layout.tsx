import CreatorContext from "./data/context";

const layout = ({
  intercept,
  dashboard,
  content,
  list,
}: {
  intercept: React.ReactNode;
  dashboard: React.ReactNode;
  content: React.ReactNode;
  list: React.ReactNode;
}) => {
  return (
    <CreatorContext>
      <main className="w-full">
        {intercept}
        <section>{dashboard}</section>
        <section className="flex w-full h-auto">
          <div className="w-[15%] h-auto">{list}</div>
          <div className="w-[85%]">{content}</div>
        </section>
      </main>
    </CreatorContext>
  );
};

export default layout;
