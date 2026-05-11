import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Result } from '../types';
import { Trophy, Medal, User, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Leaderboard: React.FC = () => {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardType, setLeaderboardType] = useState<'practice' | 'super'>('super');

  useEffect(() => {
    setLoading(true);
    const path = 'leaderboard';
    const q = query(
      collection(db, path),
      where('type', '==', leaderboardType),
      orderBy('correctDigits', 'desc'),
      orderBy('time', 'asc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Result[];
      setResults(data);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [leaderboardType]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">جاري تحميل لوحة الصدارة...</div>;
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50 space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
          <Trophy className="text-yellow-500 w-6 h-6" />
          لوحة الصدارة
        </h3>
        
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setLeaderboardType('super')}
            className={cn(
              "flex-1 py-1.5 rounded-lg font-bold transition-all text-xs",
              leaderboardType === 'super' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            السوبر باي 🏆
          </button>
          <button
            onClick={() => setLeaderboardType('practice')}
            className={cn(
              "flex-1 py-1.5 rounded-lg font-bold transition-all text-xs",
              leaderboardType === 'practice' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            التجربة 🧪
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[600px] custom-scrollbar">
        {results.map((result, index) => (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            key={result.id} 
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border transition-all",
              index === 0 
                ? "bg-blue-50 border-blue-100 shadow-md shadow-blue-50" 
                : "bg-white border-slate-100 hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner",
              index === 0 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
            )}>
              {index + 1}
            </div>
            
            <div className="flex-1">
              <div className="text-base font-bold text-slate-800 flex items-center gap-2">
                {result.name}
                {index === 0 && <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full">الأول</span>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">أرقام صحيحة</span>
                  <span className="text-xs font-bold text-blue-600">{result.correctDigits}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">الوقت</span>
                  <span className="text-xs font-bold text-slate-600">{result.time.toFixed(1)}ث</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">الدقة</span>
                  <span className="text-xs font-bold text-green-600">{result.accuracy.toFixed(1)}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">أخطاء</span>
                  <span className="text-xs font-bold text-red-500">{result.wrongCount ?? 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {results.length === 0 && (
          <div className="text-center py-20 text-slate-300">
             <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p className="font-medium">لا توجد نتائج مسجلة بعد</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           تحديث في الوقت الفعلي
        </p>
      </div>
    </div>
  );
};
