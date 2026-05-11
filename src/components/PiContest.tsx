import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Square, RefreshCcw, Save, Timer, Target, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PI_DIGITS, RATING_AR } from '../constants';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { cn } from '../lib/utils';

export const PiContest: React.FC = () => {
  const [name, setName] = useState('');
  const [input, setInput] = useState('');
  const [contestType, setContestType] = useState<'practice' | 'super'>('super');
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [time, setTime] = useState(0);
  const [result, setResult] = useState<{
    correctCount: number;
    wrongCount: number;
    accuracy: number;
    firstErrorPos: number | null;
    rating: string;
    diff: Array<{ char: string; expected: string; isCorrect: boolean }>;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setTime(prev => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isStarted, isFinished]);

  const handleStart = () => {
    if (!name.trim()) {
      alert("يرجى إدخال اسمك أولاً");
      return;
    }
    setIsStarted(true);
    setIsFinished(false);
    setInput('');
    setTime(0);
    setResult(null);
  };

  const handleFinish = async () => {
    setIsFinished(true);
    analyzeResult();
  };

  const analyzeResult = () => {
    const userDigits = input.replace(/ /g, '');
    const realDigits = PI_DIGITS.slice(0, userDigits.length);
    
    let correctCount = 0;
    let firstErrorPos = null;
    const diff: Array<{ char: string; expected: string; isCorrect: boolean }> = [];

    for (let i = 0; i < userDigits.length; i++) {
      const isCorrect = userDigits[i] === realDigits[i];
      if (isCorrect) {
        correctCount++;
      } else {
        if (firstErrorPos === null) firstErrorPos = i;
      }
      diff.push({ 
        char: userDigits[i], 
        expected: realDigits[i], 
        isCorrect 
      });
    }

    const wrongCount = userDigits.length - correctCount;
    const accuracy = userDigits.length > 0 ? (correctCount / userDigits.length) * 100 : 0;
    const rating = RATING_AR(accuracy, correctCount);

    setResult({
      correctCount,
      wrongCount,
      accuracy,
      firstErrorPos,
      rating,
      diff
    });

    saveToFirebase(correctCount, accuracy, wrongCount);
  };

  const saveToFirebase = async (correctCount: number, accuracy: number, wrongCount: number) => {
    if (correctCount === 0 && accuracy === 0) return;
    
    setIsSaving(true);
    const path = 'leaderboard';
    try {
      await addDoc(collection(db, path), {
        name: name.trim(),
        correctDigits: correctCount,
        wrongCount: wrongCount,
        accuracy: accuracy,
        time: parseFloat(time.toFixed(1)),
        type: contestType,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setIsFinished(false);
    setInput('');
    setTime(0);
    setResult(null);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Configuration Card */}
      {!isStarted && !isFinished && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center max-w-lg mx-auto"
        >
          <div className="mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg shadow-blue-100">
              π
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">مرحباً بك في مسابقة π</h2>
            <p className="text-slate-500">سجل اسمك واختر نوع المسابقة للبدء</p>
          </div>
          
          <div className="space-y-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك هنا..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-400 focus:outline-none transition-all text-center text-xl font-medium"
            />

            <div className="flex p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setContestType('super')}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold transition-all text-sm",
                  contestType === 'super' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                مسابقة السوبر باي 🏆
              </button>
              <button
                onClick={() => setContestType('practice')}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold transition-all text-sm",
                  contestType === 'practice' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                للتجربة والتدريب 🧪
              </button>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-3 text-lg group mt-8"
          >
            <Play className="fill-current w-5 h-5 group-hover:scale-110 transition-transform" />
            ابدأ التحدي الآن
          </button>
        </motion.div>
      )}

      {/* Active Contest View */}
      {isStarted && !isFinished && (
        <div className="flex flex-col h-full gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
             <div className="flex gap-4">
               <button
                  onClick={handleFinish}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-100"
                >
                  <Square className="w-5 h-5 fill-current" />
                  إنهاء التحدي
                </button>
                <button
                  onClick={handleReset}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold transition-all"
                >
                  إلغاء المسابقة
                </button>
             </div>
             <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
                <Timer className="w-5 h-5 text-blue-500 animate-pulse" />
                <span className="text-slate-500 text-sm font-bold uppercase tracking-widest">الوقت يتم حسابه في الخلفية...</span>
             </div>
          </div>

          <div className="relative flex-1 group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ابدأ بكتابة الأرقام هنا بعد 3.14..."
              className="w-full h-80 p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-3xl font-mono leading-relaxed text-slate-700 placeholder:text-slate-300 resize-none focus:outline-none focus:border-blue-400 transition-all shadow-sm"
              autoFocus
            />
            <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100 shadow-sm">
               <Target className="w-4 h-4" />
               <span>عدد الأرقام الحالي: {input.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Results View */}
      {isFinished && result && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center">
             <div className="mb-6">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-1">التقييم النهائي</p>
                <h3 className="text-5xl font-black text-slate-800 italic">{result.rating} 🌟</h3>
             </div>
             <p className="text-slate-500 font-medium">عمل رائع يا {name}! إليك تفاصيل أدائك:</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl flex flex-wrap items-center justify-between gap-8">
            <div className="flex flex-wrap gap-12">
              <div className="flex flex-col">
                <span className="text-blue-100 text-xs font-bold uppercase mb-2 tracking-wider">الأرقام الصحيحة</span>
                <span className="text-4xl font-bold">{result.correctCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-blue-100 text-xs font-bold uppercase mb-2 tracking-wider">نسبة الدقة</span>
                <span className="text-4xl font-bold">{result.accuracy.toFixed(1)}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-blue-100 text-xs font-bold uppercase mb-2 tracking-wider">أول خطأ</span>
                <span className="text-4xl font-bold">{result.firstErrorPos !== null ? result.firstErrorPos + 1 : '---'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-blue-100 text-xs font-bold uppercase mb-2 tracking-wider">الوقت المستغرق</span>
                <span className="text-4xl font-bold">{time.toFixed(1)}ث</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button
                onClick={handleReset}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-4 px-10 rounded-2xl transition-all flex items-center justify-center gap-2 text-lg border border-white/10"
              >
                <RefreshCcw className="w-5 h-5" />
                تحدي جديد
              </button>
            </div>
          </div>

          {/* Diff View */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
             <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-500" />
                تحليل الأخطاء (التصحيح)
             </h4>
             <div className="flex flex-wrap gap-x-3 gap-y-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-3xl leading-none" dir="ltr">
                {result.diff.map((item, idx) => (
                  <div key={idx} className="relative flex flex-col items-center min-w-[1ch]">
                    <span className={cn(
                      "font-bold",
                      item.isCorrect ? "text-green-600" : "text-red-500"
                    )}>
                      {item.char}
                    </span>
                    {!item.isCorrect && (
                      <>
                        <div className="absolute -bottom-1 w-full h-[3px] bg-red-400 rounded-full" />
                        <span className="absolute -bottom-10 text-xl font-bold text-blue-500">
                          {item.expected}
                        </span>
                      </>
                    )}
                  </div>
                ))}
                {result.diff.length === 0 && <p className="text-slate-400 italic text-sm font-sans mx-auto">لم يتم إدخال أي أرقام</p>}
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};;

const ResultMetric: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
    <p className="text-xs text-gray-400 mb-1">{label}</p>
    <p className={cn("text-xl font-bold font-mono", color)}>{value}</p>
  </div>
);
