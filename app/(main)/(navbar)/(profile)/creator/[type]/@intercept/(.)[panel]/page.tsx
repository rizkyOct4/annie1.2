const page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ panel: string }>;
  searchParams: Promise<{ "folder-name": string }>;
}) => {
  const path = (await params).panel;
  const folderName = (await searchParams)?.["folder-name"];
  return (
    <div className="overlay">
      <h1>{path}</h1>
      <h1>{folderName}</h1>
    </div>
  );
};

export default page;


// todo KONDISIKAN DIKIT LAGI !!!
// todo STATS DLL !! 
// todo INDEX DARI DATABASE KAU !! 