"use client";

import { creatorsContext } from "@/app/context";
import { useContext, useCallback } from "react";
import CreatorDesc from "./creator-description";
import ListProducts from "./products";
import OptionsMenu from "./option-menu";
import FormEmail from "./form-email";
import FormReport from "./form-report";
import { motion } from "framer-motion";
import { formVariants } from "@/_util/Motion";
import { useParams } from "next/navigation";

const ModalPopup = () => {
  const { publicId } = useParams<{ publicId: string }>();
  const creatorId = publicId;

  const { open, setOpen } =
    useContext(creatorsContext);

  const renderContent = useCallback(() => {
    switch (open.isValue) {
      case "Email":
        return <FormEmail />;
      case "Products":
        return (
          <ListProducts creatorId={creatorId} />
        );
      case "Report":
        return <FormReport creatorId={creatorId} />;
      case "Profile":
        return <CreatorDesc />;
      //   case "Profile":
      //     return <CreatorDesc data={creatorDescriptionData} />;
      default:
        return null;
    }
  }, [creatorId, open.isValue]);

  return (
    <motion.div initial="hidden" animate="visible" variants={formVariants}>
      <div className="overlay backdrop-blur-sm">
        <div className="flex w-[1000px] h-[560px] bg-gray-50/50 rounded-xl relative">
          <div className="flex flex-col md:flex-row h-auto">
            <OptionsMenu open={open} setOpen={setOpen} />
          </div>
          <div className="w-full overflow-hidden h-[560px] p-4">
            {renderContent()}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModalPopup;
