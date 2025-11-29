"use client";

import dynamic from "next/dynamic";
import { SLoading } from "@/_util/Spinner-loading";
import React from "react";
// import Engagement from "./components/engagement";

const LazyOverview = dynamic(
  () => import("./components/overview"),
  {
    loading: () => <SLoading />,
  }
);
const LazyCharts = dynamic(
  () => import("./components/charts"),
  {
    loading: () => <SLoading />,
  }
);
const LazyDate = dynamic(
  () => import("./components/date"),
  {
    loading: () => <SLoading />,
  }
);
const LazyAudience = dynamic(
  () => import("./components/audience"),
  {
    loading: () => <SLoading />,
  }
);
const LazyMilestones = dynamic(
  () => import("./components/milestone"),
  {
    loading: () => <SLoading />,
  }
);

const ModalPanel = () => {
  return (
    <div className="overlay backdrop-blur-sm">
      <div className="flex w-full h-screen gap-4 flex-col p-10">
        {/* Kolom kiri: Tanggal */}
        <div className="w-[100%] h-auto">
          <LazyDate />
        </div>

        {/* Kolom tengah: Overview / Content */}
        <div className="flex gap-2 w-full h-[100%] overflow-y-auto">
          <div className="flex flex-col gap-4 w-[70%]">
            <LazyOverview />
          </div>

          {/* Kolom kanan: Charts */}
          <div className="flex flex-col gap-4 w-[30%]">
            <LazyCharts />
            <LazyOverview />
            <LazyMilestones />
            <LazyAudience />
            {/* <Engagement /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalPanel;
