import { CATEGORY } from "@/config/api/sidebar/discover/category/api";
import ModalDescription from "./description";
import { cookies } from "next/headers";

const Modal = async ({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ id: string }>;
}) => {
  const par = (await params).type;
  const searchQuery = (await searchParams).id;
  const cookieHeader = (await cookies()).toString();
  const URL = CATEGORY("idCategory", par, searchQuery);

  const res = await fetch(URL, {
    headers: {
      Cookie: cookieHeader, // forward cookie user
    },
    next: { revalidate: 60 * 2 },
  });

  const data = await res.json();

  return <>{searchQuery && <ModalDescription data={data} />}</>;
};

export default Modal;
