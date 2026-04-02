import React, { useState, useEffect } from "react";
import { db, auth } from "../services/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { X } from "lucide-react";

const NPSSurvey = () => {
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkAndShow = async () => {
      // Check if it's 5pm SAST (UTC+2)
      const now = new Date();
      const sastHour = (now.getUTCHours() + 2) % 24;
      if (sastHour < 17) {
        // Schedule for 5pm SAST
        const msUntil5pm = ((17 - sastHour) * 60 * 60 - now.getUTCMinutes() * 60 - now.getUTCSeconds()) * 1000;
        const timer = setTimeout(() => setVisible(true), msUntil5pm);
        return () => clearTimeout(timer);
      }

      // Already past 5pm — check if user already responded today
      const todayStr = now.toISOString().slice(0, 10);
      const dismissed = localStorage.getItem("nps_dismissed");
      if (dismissed === todayStr) return;

      setVisible(true);
    };

    checkAndShow();
  }, []);

  const handleDismiss = () => {
    const todayStr = new Date().toISOString().slice(0, 10);
    localStorage.setItem("nps_dismissed", todayStr);
    setVisible(false);
  };

  const handleSubmit = async () => {
    if (score === null) return;
    try {
      const user = auth.currentUser;
      await addDoc(collection(db, "nps_responses"), {
        score,
        comment,
        userId: user?.uid || "guest",
        email: user?.email || "guest",
        submittedAt: serverTimestamp(),
        date: new Date().toISOString().slice(0, 10),
      });
      const todayStr = new Date().toISOString().slice(0, 10);
      localStorage.setItem("nps_dismissed", todayStr);
      setSubmitted(true);
      setTimeout(() => setVisible(false), 2500);
    } catch (e) {
      console.error("NPS submit error:", e);
    }
  };

  if (!visible) return null;

  const getScoreColor = (s) => {
    if (s <= 6) return "bg-red-500";
    if (s <= 8) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        {submitted ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">??</div>
            <h3 className="text-white text-xl font-bold mb-2">Thanks for your feedback!</h3>
            <p className="text-gray-400 text-sm">We really appreciate it.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">How are we doing?</h3>
              <button onClick={handleDismiss} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              How likely are you to recommend <span className="text-purple-400 font-semibold">Family Binge</span> to a friend?
            </p>
            <div className="flex gap-1 justify-between mb-2">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <button
                  key={n}
                  onClick={() => setScore(n)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    score === n
                      ? `${getScoreColor(n)} text-white scale-110`
                      : "bg-zinc-800 text-gray-400 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mb-5">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Any comments? (optional)"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 resize-none mb-4 focus:outline-none focus:border-purple-500"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              disabled={score === null}
              className={`w-full py-3 rounded-xl font-bold text-white transition-all ${
                score !== null
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-zinc-700 cursor-not-allowed opacity-50"
              }`}
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default NPSSurvey;
