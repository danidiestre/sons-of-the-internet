"use client";

import React from "react";

export function ScheduleSection() {
  return (
    <section className="w-full py-8 sm:py-12">
      <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
        <div className="mb-8 text-center">
          <h3 className="text-white text-2xl sm:text-3xl font-semibold tracking-tight mb-2" style={{ fontFamily: 'var(--font-space-mono)' }}>
            Schedule
          </h3>
          <p className="text-white/60">Weekly program structure</p>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <div className="min-w-full border border-white/10 rounded-lg overflow-hidden">
            <table className="w-full table-fixed">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="w-32 px-4 py-4 text-left text-sm font-semibold text-white">Time</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white">Mon</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white">Tue</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white">Wed</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white">Thu</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white">Fri</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white">Sat</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold text-white">Sun</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {/* Morning Row */}
                <tr className="bg-blue-500/10 hover:bg-blue-500/15 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-white bg-white/5">09:00–13:00</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Check In</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Demo Day</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Morning activity + Check out</td>
                </tr>
                {/* Lunch Row */}
                <tr className="bg-orange-500/10 hover:bg-orange-500/15 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-white bg-white/5">13:00–15:00</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Public Event – Paella (60 Attendees)</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Lunch</td>
                </tr>
                {/* Afternoon Row */}
                <tr className="bg-purple-500/10 hover:bg-purple-500/15 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-white bg-white/5">15:00–18:00</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Work Time</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">DJ + Drinks</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Reflect & Harvest</td>
                </tr>
                {/* Evening Row */}
                <tr className="bg-pink-500/10 hover:bg-pink-500/15 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-white bg-white/5">18:00+</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Intros & Goals</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Inspiration talk</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Network Afternoon</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Chef Dinner</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Demo Day</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">DJ + Drinks</td>
                  <td className="px-4 py-4 text-sm text-white text-center h-20">Check out</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {/* Monday */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold text-base mb-3">Monday</h4>
            <div className="space-y-2 text-sm text-white">
              <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Check In</div>
              <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
              <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
              <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Intros & Goals</div>
            </div>
          </div>

          {/* Tuesday */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold text-base mb-3">Tuesday</h4>
            <div className="space-y-2 text-sm text-white">
              <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Work Time</div>
              <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
              <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
              <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Inspiration talk</div>
            </div>
          </div>

          {/* Wednesday */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold text-base mb-3">Wednesday</h4>
            <div className="space-y-2 text-sm text-white">
              <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Work Time</div>
              <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
              <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
              <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Network Afternoon</div>
            </div>
          </div>

          {/* Thursday */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold text-base mb-3">Thursday</h4>
            <div className="space-y-2 text-sm text-white">
              <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Work Time</div>
              <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
              <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
              <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Chef Dinner</div>
            </div>
          </div>

          {/* Friday */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold text-base mb-3">Friday</h4>
            <div className="space-y-2 text-sm text-white">
              <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Work Time</div>
              <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
              <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Work Time</div>
              <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Demo Day</div>
            </div>
          </div>

          {/* Saturday */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold text-base mb-3">Saturday</h4>
            <div className="space-y-2 text-sm text-white">
              <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Demo Day</div>
              <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Public Event – Paella (60 Attendees)</div>
              <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → DJ + Drinks (all day)</div>
              <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → DJ + Drinks</div>
            </div>
          </div>

          {/* Sunday */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-semibold text-base mb-3">Sunday</h4>
            <div className="space-y-2 text-sm text-white">
              <div className="bg-blue-500/10 px-3 py-3 rounded h-14 flex items-center">09:00–13:00 → Morning activity + Check out</div>
              <div className="bg-orange-500/10 px-3 py-3 rounded h-14 flex items-center">13:00–15:00 → Lunch</div>
              <div className="bg-purple-500/10 px-3 py-3 rounded h-14 flex items-center">15:00–18:00 → Reflect & Harvest</div>
              <div className="bg-pink-500/10 px-3 py-3 rounded h-14 flex items-center">18:00+ → Check out</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

