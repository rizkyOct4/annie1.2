"use client";

import { creatorsContext } from "@/app/context";
import { useContext, useCallback, useState } from "react";
import CreatorDesc from "./creator-description";
import ImageContainer from "./photo/photo";
import VideoContainer from "./video/video";
import OptionsMenu from "./option-menu";
import FormEmail from "../../../form/form-email";
import FormReport from "../../../form/form-report";
import { useParams } from "next/navigation";

const ModalPopup = () => {
  const { id } = useParams<{ id: string }>();

  const {
    open,
    setOpen,
    creatorDescriptionData,
    ListCreatorVideoData,
    sortItemVideo,
    sortVideo,
  } = useContext(creatorsContext);

  const [renderAction, setRenderAction] = useState<string>("");

  const renderContent = useCallback(() => {
    switch (open.isValue) {
      case "Photos":
        return <ImageContainer creatorId={id} />;
      case "Videos":
        return (
          <VideoContainer
            data={sortVideo === "latest" ? sortItemVideo : ListCreatorVideoData}
          />
        );
      case "Profile":
        return (
          <CreatorDesc
            data={creatorDescriptionData}
            setRenderAction={setRenderAction}
          />
        );
    }
  }, [
    open.isValue,
    id,
    sortVideo,
    sortItemVideo,
    ListCreatorVideoData,
    creatorDescriptionData,
  ]);

  const renderActions = useCallback(() => {
    switch (renderAction) {
      case "email": {
        return <FormEmail setRenderAction={setRenderAction} />;
      }
      case "report": {
        return <FormReport setRenderAction={setRenderAction} />;
      }
    }
  }, [renderAction]);

  return (
    <>
      <div className="overlay backdrop-blur-sm">
        <div className="flex w-250 h-180 rounded-md relative overflow-hidden border-emerald-500 border">
          <div className="flex flex-col md:flex-row h-auto">
            <OptionsMenu open={open} setOpen={setOpen} />
          </div>
          <div className="w-full h-full p-4 overflow-y-auto">
            {renderContent()}
          </div>
        </div>
      </div>
      {renderActions()}
    </>
  );
};

export default ModalPopup;
