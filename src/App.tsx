import { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import CaregiverApp from './components/mobile/CaregiverApp';
import { Layout, LogIn, ShieldCheck, Heart, Activity, Bell } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create profile
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        } else {
          const newProfile: UserProfile = {
            uid: currentUser.uid,
            name: currentUser.displayName || 'User',
            email: currentUser.email || '',
            role: 'caregiver' // Default to caregiver for demo
          };
          await setDoc(doc(db, 'users', currentUser.uid), newProfile);
          setProfile(newProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full"></div>
          <div className="h-4 w-32 bg-indigo-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-3xl shadow-2xl shadow-black/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/50">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">ElderGuard</h1>
          </div>
          <p className="text-slate-400 mb-10 leading-relaxed text-lg">
            AI-powered monitoring for elderly safety and health. Premium care at your fingertips.
          </p>
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 gradient-bg text-white py-5 px-6 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-all active:scale-95"
          >
            <LogIn className="w-5 h-5" />
            Get Started
          </button>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-12 max-w-2xl w-full opacity-20 grayscale invert">
           <div className="flex flex-col items-center gap-3">
             <Heart className="w-8 h-8" />
             <span className="text-[10px] uppercase tracking-widest font-bold">Vitals</span>
           </div>
           <div className="flex flex-col items-center gap-3">
             <Activity className="w-8 h-8" />
             <span className="text-[10px] uppercase tracking-widest font-bold">Activity</span>
           </div>
           <div className="flex flex-col items-center gap-3">
             <Bell className="w-8 h-8" />
             <span className="text-[10px] uppercase tracking-widest font-bold">Alerts</span>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-[#F0F4FF] text-slate-800 font-sans">
      <CaregiverApp user={user} profile={profile!} />
    </div>
  );
}
