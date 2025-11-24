import CreatorContext from "./data/context";

const layout = ({
  dashboard,
  content,
  list,
}: {
  dashboard: React.ReactNode;
  content: React.ReactNode;
  list: React.ReactNode;
}) => {
  return (
    <CreatorContext>
      <main className="w-full">
        <section>{dashboard}</section>
        <section className="flex w-full">
          <div className="w-[20%]">{list}</div>
          <div className="w-[80%]">{content}</div>
        </section>
      </main>
    </CreatorContext>
  );
};

export default layout;
