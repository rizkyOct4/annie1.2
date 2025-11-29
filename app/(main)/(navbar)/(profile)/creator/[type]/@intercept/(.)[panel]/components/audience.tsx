"use client";

import React, { memo } from "react";

// Dummy audience data
const audienceData = {
  totalUsers: 1250,
  newUsersToday: 34,
  gender: {
    male: 650,
    female: 600,
  },
  ageGroups: [
    { range: "18-24", count: 400 },
    { range: "25-34", count: 500 },
    { range: "35-44", count: 250 },
    { range: "45+", count: 100 },
  ],
  topLocations: [
    { country: "USA", count: 450 },
    { country: "UK", count: 200 },
    { country: "Germany", count: 150 },
    { country: "Indonesia", count: 100 },
  ],
};

const Audience = () => {
  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-sm">
      {/* Ringkasan total audience */}
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
        <div>
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-xl font-bold">{audienceData.totalUsers}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">New Today</p>
          <p className="text-lg font-semibold">{audienceData.newUsersToday}</p>
        </div>
      </div>

      {/* Gender */}
      <div className="flex gap-4">
        {Object.entries(audienceData.gender).map(([gender, count]) => (
          <div
            key={gender}
            className="flex-1 p-2 bg-gray-50 rounded flex flex-col items-center"
          >
            <p className="text-sm capitalize">{gender}</p>
            <p className="font-semibold">{count}</p>
          </div>
        ))}
      </div>

      {/* Age Groups */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Age Groups</p>
        <div className="flex gap-2">
          {audienceData.ageGroups.map((group) => (
            <div
              key={group.range}
              className="flex-1 p-2 bg-gray-50 rounded flex flex-col items-center"
            >
              <p className="text-xs">{group.range}</p>
              <p className="font-semibold">{group.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-gray-600">Top Locations</p>
        <div className="flex flex-col gap-1">
          {audienceData.topLocations.map((loc) => (
            <div
              key={loc.country}
              className="flex justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm">{loc.country}</span>
              <span className="font-semibold">{loc.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(Audience);
