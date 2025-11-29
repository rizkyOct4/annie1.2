import ModalPanel from "./modal";

const page = async({
  params,
  searchParams,
}: {
  params: Promise<{ panel: string }>;
  searchParams: Promise<{ "folder-name": string }>;
}) => {
  const pathUrl = (await params).panel
  const pathFolderName = (await searchParams)?.["folder-name"]


  return (
    <>
      <ModalPanel />
    </>
  );
};

export default page;
