import CreatorContext from "./context/context";
import PanelPage from "./panel";

const layout = async ({
  dashboard,
  content,
  list,
  params,
}: {
  dashboard: React.ReactNode;
  content: React.ReactNode;
  list: React.ReactNode;
  params: Promise<{ type: string }>;
}) => {
  const currentPath = (await params)?.type;
  return (
    <>
      {currentPath && (
        <CreatorContext>
          <main className="w-full p-4">
            <PanelPage />
            <section>{dashboard}</section>
            <section className="flex w-full h-auto">
              <div className="w-[12%] h-auto">{list}</div>
              <div className="w-[88%]">{content}</div>
            </section>
          </main>
        </CreatorContext>
      )}
    </>
  );
};

export default layout;
