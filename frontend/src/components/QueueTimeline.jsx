'use client';

import React, { useState, useEffect } from 'react';
import { generateTimelineSlots } from '@/lib/utils';

const QueueTimeline = () => {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    setSlots(generateTimelineSlots());
  }, []);

  return (
    <div className="metric-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Daily Timeline (08:00 - 18:00)</h2>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-max gap-1 p-4 bg-gray-50 rounded-lg">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="timeline-slot timeline-empty"
              title={slot.time}
            >
              {slot.time}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span>Empty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 border border-gray-300 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 border border-gray-300 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-amber-200 border border-gray-300 rounded"></div>
          <span>Late</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-violet-200 border border-gray-300 rounded"></div>
          <span>Buffer</span>
        </div>
      </div>
    </div>
  );
};

export default QueueTimeline;
