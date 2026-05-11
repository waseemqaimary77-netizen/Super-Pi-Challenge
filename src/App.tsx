/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PiContest } from './components/PiContest';
import { Leaderboard } from './components/Leaderboard';
import { Calculator, Github } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" dir="rtl">
      {/* Header */}
      <header className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center md:items-end border-b border-slate-200 gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-right">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-serif text-2xl shadow-lg shadow-blue-200">π</span>
            مسابقة السوبر باي
          </h1>
          <p className="text-slate-500 text-sm mt-1">تحدي الذكاء والسرعة لطلاب الحصاد بأدارة دائرة الرياضيات</p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex items-center gap-3">
             <div className="w-20 h-20 relative overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                <img 
                  src="https://i.ibb.co/qLZpm4J8/Whats-App-Image-2026-03-06-at-6-19-47-PM.jpeg" 
                  alt="School Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div className="w-20 h-20 relative overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                <img 
                  src="https://i.ibb.co/Qj1HC0Kx/Whats-App-Image-2026-03-06-at-6-19-48-PM.jpeg" 
                  alt="Department Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div className="bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm text-xs font-medium">
                تطوير: <span className="text-blue-600 font-bold">وسيم قيمري</span>
             </div>
          </div>
          <div className="text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1">
             بإشراف رئيس دائرة الرياضيات: <span className="font-black text-slate-900 text-lg underline decoration-blue-500 decoration-2 underline-offset-4">أستاذ مصعب فشافشة</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Contest Area */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <PiContest />
          </div>

          {/* Sidebar Area */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            <div className="sticky top-8">
              <Leaderboard />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
            Mathematics Department • Excellence Program 2026
          </p>
          <p className="text-[10px] text-slate-300 mt-1 uppercase">
            Al-Hassad School
          </p>
        </div>
      </footer>
    </div>
  );
}

